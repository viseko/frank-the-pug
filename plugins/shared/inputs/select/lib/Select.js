export default class Select {
  constructor(elem) {
    const btn = elem.querySelector("[data-role='btn']");
    const select = elem.querySelector("[data-role='select']");
    const value = elem.querySelector("[data-role='value']");
    const list = elem.querySelector("[data-role='list']");

    this.openStateClass = "_show";
    this.isOpen = false;
    this.elem = elem;
    this.select = select;
    this.value = value;
    this.btn = btn;
    this.list = list;

    this.defaultValue = select.value;

    document.addEventListener("click", (e) => {
      const buttonTarget = e.target.closest("[data-role='btn']");
      if (buttonTarget === this.btn) {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      } else if (this.isOpen) {
        this.close();
      }
    });

    select.addEventListener("change",  () => {
      this.setValue(select.value, true);
    });

    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const value = btn.dataset.value;
      this.setValue(value);
    })
  }

  open() {
    this.setListPosition();
    this.elem.classList.add(this.openStateClass);
    this.isOpen = true;
  }

  close () {
    this.elem.classList.remove(this.openStateClass);
    this.isOpen = false;
  }

  setValue(val) {
    const disabledBtn = this.list.querySelector("[disabled]");
    disabledBtn && (disabledBtn.disabled = false);

    const targetBtn = this.list.querySelector(`[data-value='${val}']`);
    if (!targetBtn) return;

    targetBtn.disabled = true;
    this.select.value = val;

    this.value.innerText = val;
  }

  reset() {
    this.select(this.defaultValue);
  }

  setListPosition() {
     const rect = this.elem.getBoundingClientRect();
     const width = this.elem.offsetWidth;
     const height = this.elem.offsetHeight;
     const windowWidth = document.documentElement.clientWidth;
     const windowHeight = document.documentElement.clientHeight;
     const listHeight = this.list.offsetHeight;
     const listWidth = this.list.offsetWidth;

     const top = rect.top;
     const left = rect.left;
     const right = windowWidth - width - left;
     const bottom = windowHeight - top - height;

     if (left < (listWidth - width) / 2) {
      this.list.style.left = `calc(50% + ${(listWidth - width) / 2}px)`;
     } else if (right < (listWidth - width) / 2) {
      this.list.style.right = `calc(50% - ${(listWidth - width) / 2}px)`;
     } else {
      this.list.style.right = "";
      this.list.style.left = "";
     }

     if (bottom < listHeight && top > listHeight) {
      this.list.style.bottom = "calc(100% + 16px)";
      this.list.style.top = "unset";
     } else {
      this.list.style.bottom = "";
      this.list.style.top = "";
     }
  }
}