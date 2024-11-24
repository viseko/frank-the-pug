import InputNumber from "../field/lib/FieldNumber.js";

export default class Counter extends InputNumber {
  constructor(elem, options) {
    super(elem, options);

    // Устанавливаем шаг изменения значения с проверкой на корректность
    this.step = this.validateNumber(this._inputElem.step, 1);

    // Находим кнопки увеличения и уменьшения
    this.btnPlus = elem.querySelector("[data-role='plus']");
    this.btnMinus = elem.querySelector("[data-role='minus']");

    // Добавляем обработчики событий для кнопок
    this.btnPlus.addEventListener("click", () => this.changeValue(this.step));
    this.btnMinus.addEventListener("click", () => this.changeValue(-this.step));

    // Инициализируем допустимые значения, если они заданы
    this.initAllowedValues();
  }

  // Валидация числовых значений
  validateNumber(value, defaultValue) {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }

  // Инициализация допустимых значений из дата-атрибута
  initAllowedValues() {
    const allowedString = this._inputElem.dataset.allowed;
    if (!allowedString) return;

    try {
      // Преобразуем строку в массив чисел и удаляем дубликаты
      const allowedArray = allowedString
        .split(",")
        .map(Number)
        .filter((num) => !isNaN(num))
        .sort((a, b) => a - b);
      if (allowedArray.length < 1) return;

      this.allowed = [...new Set(allowedArray)];
      this.allowedMode = true;

      // Приводим текущее значение к ближайшему допустимому
      this.adjustToAllowedValue();
      this._inputElem.addEventListener(
        "input",
        this.adjustToAllowedValue.bind(this)
      );
    } catch (error) {
      console.error("Ошибка при инициализации допустимых значений:", error);
    }
  }

  // Приведение текущего значения к ближайшему допустимому
  adjustToAllowedValue() {
    if (!this.allowedMode || !this.allowed || this.allowed.length < 1) return;

    const value = this.validateNumber(this._inputElem.value, this.allowed[0]);
    const valueIndex = this.allowed.indexOf(value);

    // Если текущее значение допустимо, сохраняем его индекс
    if (valueIndex >= 0) {
      this.valueIndex = valueIndex;
      return;
    }

    // Определяем ближайшее допустимое значение
    const setArray = [...new Set([...this.allowed, value])].sort(
      (a, b) => a - b
    );
    let valuePos = setArray.indexOf(value);
    if (valuePos === this.allowed.length) valuePos--;

    this.valueIndex = valuePos;
    this._inputElem.value = this.allowed[valuePos];
  }

  // Изменение значения на заданный шаг
  changeValue(delta) {
    if (this.allowedMode) {
      this.changeAllowedValue(delta);
    } else {
      this.changeUnrestrictedValue(delta);
    }
  }

  // Изменение значения в режиме допустимых значений
  changeAllowedValue(delta) {
    const newIndex = this.valueIndex + delta;
    if (newIndex >= 0 && newIndex < this.allowed.length) {
      this.valueIndex = newIndex;
      this._inputElem.value = this.allowed[this.valueIndex];
    }
  }

  // Изменение значения в обычном режиме
  changeUnrestrictedValue(delta) {
    const value = this.validateNumber(
      this._inputElem.value.replace(/\D/g, ""),
      0
    );
    const newValue = value + delta;

    // Проверка на выход за пределы min и max
    if (
      (delta > 0 && (!this.max || newValue <= this.max)) ||
      (delta < 0 && (!this.min || newValue >= this.min))
    ) {
      this._inputElem.value = newValue;
      this.handleBlur();
    }
  }
}
