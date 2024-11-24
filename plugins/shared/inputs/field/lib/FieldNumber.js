import FieldText from "./FieldText.js";

export default class FieldNumber extends FieldText {
  constructor(elem, options) {
    super(elem, options);

    this.unit = options.unit || this._inputElem.dataset.unit;
    this.min = Number(this._inputElem.min);
    this.max = Number(this._inputElem.max);
    this.callback = options.callback;
    this.formatNumber = options.formatNumber || false;

    this._inputElem.type = "text";
    this._inputElem.addEventListener("input", this.handleInput.bind(this));

    this._inputElem.addEventListener("focus", this.handleFocus.bind(this));

    this._inputElem.addEventListener("blur", this.handleBlur.bind(this));

    this._inputElem.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this._inputElem.blur();
      }
    })

    this.handleBlur();
    return this;
  }

  handleInput() {
    // Allow input only numbers
    this._inputElem.value = this._inputElem.value.replace(/\D/g, "");

    this.checkRange();
  }

  handleFocus() {
    // Remove spaces when focus
    this._inputElem.value = this._inputElem.value.replace(/\s/g, "");

    if (this.unit) {
      const regexp = new RegExp(`${this.unit}$`);
      this._inputElem.value = this._inputElem.value.replace(regexp, "");
    }
  }

  handleBlur() {
    const value = Number(this._inputElem.value);

    // Bring value to acceptable range
    if (this.min && value < this.min) {
      this._inputElem.value = this.min;
    } else if (this.max && value > this.max) {
      this._inputElem.value = this.max;
    }

    if (this.callback) {
      this.callback(this._inputElem.value);
    }

    // Разделение числа пробелами
    if (this.formatNumber) {
      this._inputElem.value = this._inputElem.value.replace(
        /(\d)(?=(\d{3})+$)/g,
        "$1 "
      );
    }

    // Добавление ед. измерения
    if (this.unit && this._inputElem.value.length) {
      this._inputElem.value = this._inputElem.value.replace(/$/, ` ${this.unit}`);
    }
  }

  checkRange() {
    const input = this._inputElem;
    const val = parseInt(input.value);

    if (this.min && (val < this.min)) {
      input.value = this.min;
    }

    if (this.max && (val > this.max)) {
      input.value = this.max;
    }
  }
}
