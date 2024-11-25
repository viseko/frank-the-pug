const focusStateClass = "_focus";

export default class FieldCode {
  constructor(elem) {
    const field = elem.querySelector("input");
    const cells = [...elem.querySelectorAll("label span")];

    this.field = field;
    this.cells = cells;

    field.addEventListener("input", this.inputHandler.bind(this));
    field.addEventListener("focus", this.focusHandler.bind(this));
    field.addEventListener("blur", this.hideFocus.bind(this));
  }

  inputHandler() {
    const field = this.field;
    const value = field.value;
    
    field.value = value.replace(/\D/g, "").slice(0, this.cells.length);

    for (let i = 0; i <  this.cells.length; i++) {
      this.cells[i].innerHTML = field.value[i] || "";
    }

    this.showFocus.call(this);
  }

  focusHandler() {
    this.showFocus.call(this);
  }

  showFocus() {
    const field = this.field;
    const value = field.value;

    this.hideFocus.call(this);
    this.cells[Math.min(this.cells.length - 1, value.length)].classList.add(focusStateClass);
  }

  hideFocus() {
    this.cells.forEach(cell => {
      cell.classList.remove(focusStateClass);
    })
  }
}