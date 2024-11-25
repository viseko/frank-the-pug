export default class FieldRate {
  constructor(elem) {
    const buttons = [...elem.querySelectorAll("button")];
    const field = elem.querySelector("[type=number]");
    const value = Number(field.value);

    this.field = field;
    this.buttons = buttons;

    this.fillStars(value);

    buttons.forEach((btn, i) => {
      const val = i + 1;

      btn.addEventListener("click", () => {
        this.setValue.call(this, val);
      });

      btn.addEventListener("mouseenter", () => {
        this.fillStars.call(this, val);
      });

      btn.addEventListener("mouseleave", () => {
        this.fillStars.call(this, this.field.value);
      });
    });
  }

  setValue(val) {
    this.field.value = val;
  }

  fillStars(num) {
    this.buttons.forEach(btn => {
      btn.classList.remove("_fill");
    });
    
    for (let i = 0; i < num; i++) {
      this.buttons[i].classList.add("_fill");
    }
  }
}