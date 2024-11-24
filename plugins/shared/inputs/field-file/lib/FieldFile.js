export default class InputFile {
  constructor(elem, options) {
    this.elem = elem;
    this.maxSize = options.maxSize;
    this.fileTemplate = elem.querySelector("template");

    this.input = this.elem.querySelector("[type=file]");
    this.listElem = this.elem.querySelector("[data-role=list]");

    this.input.addEventListener("input", this.handleInput.bind(this));
    this.listElem.addEventListener("click", this.handleClick.bind(this));
    this.input.addEventListener("reset", this.reset.bind(this));

    this.filesList = [];

    // Добавление поля в глоб. область видимости
    const form = this.input.closest("form");
    if (form) {
      if (!form.inputFields) {
        form.inputFields = {};
      }
  
      const name = this.input.name;
      if (name) {
        form.inputFields[name] = this;
      }
    }
  }

  handleInput() {
    this.listElem.innerHTML = "";

    const files = [...this.input.files];
    files.forEach(this.addFile.bind(this));
  }

  handleClick(e) {
    const btn = e.target.closest("[data-fileid]");
    if (btn) {
      this.removeFile(btn.dataset.fileid);
    }
  }

  addFile(file) {
    const id = Number(Date.now()).toString(32);
    const fileName = file.name;

    const elem = this.fileTemplate.content.cloneNode(true);
    const fileNameElem = elem.querySelector("[data-role=filename]");
    const btn = elem.querySelector("[data-role=remove]");

    btn.dataset.fileid = id;
    fileNameElem.innerText = fileName;

    const fileData = {
      id,
      fileName,
      file,
      elem: elem.querySelector(".field-file__list-item"),
    };

    this.filesList = [...this.filesList, fileData];

    
    this.renderList();
    this.updateFiles();
  }

  renderList() {
    this.listElem.innerHTML = "";
    this.filesList.forEach(fileItem => {
      this.listElem.append(fileItem.elem);
    });
  }

  updateFiles() {
    const list = new DataTransfer();
    this.filesList.forEach(fileItem => {
      const file = new File([fileItem.file], fileItem.fileName);
      list.items.add(file);
    });
    
    this.input.files = list.files;
  }

  removeFile(id) {
    const file = this.filesList.find((el) => el.id === id);
    if (!file) {
      return;
    }

    this.filesList = this.filesList.filter((el) => el !== file);

    this.renderList();
    this.updateFiles();
  }

  reset() {
    this.filesList = [];
    this.renderList();
    this.updateFiles();
  }
}
