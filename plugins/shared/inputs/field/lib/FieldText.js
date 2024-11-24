import addMask from "../../../_lib/add-mask.js";

// HTML-классы состояний
const STATES = {
  error: "_error",
  value: "_has-value",
  success: "_success",
  required: "_required",
};

// Вывод ошибок
const ERRORS = {
  required: "Это обязательное поле",
  minlength: "Значение должно быть не меньше %n",
  pattern: "Некорректный формат",
  repeat: "Значения не совпадают"
};

export default class FieldText {
  constructor(elem, options) {
    // Опции
    this.required = options.required || false; // Обязательное поле (bool)
    this.mask = options.mask; // Маска ввода (string)
    this.minLength = options.minLength || 0; // Мин. длина (number)
    this.maxLength = options.maxLength || 0; // Макс. длина (number)
    this.blurValidate = options.blurValidate || false; // Валидация после снятия фокуса (bool)
    this.inputValidate = options.inputValidate || false; // Валидация при вводе (bool)
    this.pattern = options.pattern; // Шаблон ввода (regexp)
    this.onChange = options.onChange; // callback -- TODO
    this.onInput = options.onInput; // callback -- TODO
    this.onBlur = options.onBlur; // callback -- TODO
    this.errors = {
      // Тексты для вывода об ошибках ввода
      ...ERRORS,
      ...options.errors,
    };

    // HTML-элементы
    this._elem = elem; // Обёртка
    this._inputElem =
      elem.querySelector("input") || elem.querySelector("textarea"); // Поле ввода
    this._errorElem =
      elem.querySelector(options.errorSelector) ||
      elem.querySelector("[data-role='error']"); // Текст ошибки

    // Доп. поля
    this.value = this._inputElem.value || options.value || ""; // Дефолтное значение поля после сброса
    this.maskHander = null; // Обработчик событий наложения маски ввода: input, focus, blur

    // Проверка параметров инпута
    // * required
    if (this._inputElem.required) {
      this.required = true;
    }

    // * minlength
    if (this._inputElem.hasAttribute("minlength")) {
      this.minLength = this._inputElem.getAttribute("minlength");
    }

    // * maxlength
    if (this._inputElem.maxlength) {
      this.maxLength = this._inputElem.maxlength;
    }

    // * поле, которое нужно повторить
    if (this._inputElem.dataset.repeat) {
      const repeat = this._inputElem.dataset.repeat;
      this.repeat = document.getElementById(repeat);
    }

    // Добавление маски, если требуется
    if (this.mask) {
      this.maskHandler = addMask(this._inputElem, this.mask);
    }

    // Добавление класса для обязательного элемента
    if (this.required) {
      this._elem.classList.add(STATES.required);
    }

    // Ввод - основной обработчик
    this._inputElem.addEventListener("input", () => {
      //  * снимаем состояние ошибки
      if (!this.valid) {
        this.valid = true;
        this._elem.classList.remove(STATES.error);
      }

      // * затем обрабатываем значение
      this.checkValue.call(this);
    });

    // Валидация поля при снятии фокуса
    if (this.blurValidate) {
      this._inputElem.addEventListener("blur", this.validate.bind(this));
    }

    // Валидация поля при вводе
    if (this.inputValidate) {
      this._inputElem.addEventListener("input", this.validate.bind(this));
    }

    // Колбеки
    if (this.onChange || this.onInput || this.onBlur) {
      const input = this._inputElem;

      this.onChange &&
        input.addEventListener("change", this.onChange);
      this.onInput && input.addEventListener("change", this.onInput);
      this.onBlur && input.addEventListener("change", this.onBlur);
    }

    // Прописка инстанса в родительскую форму (для валидации и сброса полей)
    const parentForm = this._elem.closest("form");
    if (parentForm) {
      if (!parentForm.inputFields) {
        parentForm.inputFields = {};
      }

      const name = this._inputElem.name;
      if (name) {
        parentForm.inputFields[name] = this;
      }
    }

    // Проверка наличия значения с задержкой (для правильного отображения аним. плейсхолдеров)
    setTimeout(() => {
      this.checkValue.call(this);
    }, 100);

    // Прописка инстанса в элемент
    elem.FieldText = this;

    // Ресайз textarea
    if (elem.querySelector("textarea")) {
      const textarea = this._inputElem;

      textarea.setAttribute("rows", "1");
      textarea.addEventListener("keydown", this.resizeTextarea)
    }

    return this;
  }

  // Проверка наличия значения
  checkValue() {
    const elem = this._elem;
    const input = this._inputElem;
    const value = input.value;

    // Обрезка по макс. длине, если есть
    if (this.maxLength > 0) {
      input.value = value.slice(0, this.maxLength);
    }

    // Добавление класса состояния
    if (value.length > 0) {
      elem.classList.add(STATES.value);
    } else {
      elem.classList.remove(STATES.value);
    }
  }

  // Валидация поля
  validate() {
    const validateBy = this.validateBy.bind(this);
    const value = this._inputElem.value;

    if (value.length > 1) {
      // Валидация по шаблону
      this.pattern &&
        validateBy(this.pattern.test(value), this.errors["pattern"]);

      // Валидация по мин. длине
      this.valid &&
        this.minLength > 1 &&
        validateBy(
          value.length >= this.minLength,
          this.errors["minlength"],
          this.minLength
        );
    } else if (this.required) {
      // Проверка обязательного поля
      validateBy(value.length >= 1, this.errors["required"]);
    } else {
      this._elem.classList.remove(STATES.error);
    }

    if (this.repeat) {
      const targetValue = this.repeat.value;
      validateBy(value === targetValue, this.errors["repeat"]);
    }

    return this.valid;
  }

  setValid() {
    this._elem.classList.add(STATES.success);
    this._elem.classList.remove(STATES.error);
    this.valid = true;
  }

  setInvalid(errorText) {
    this._elem.classList.add(STATES.error);
    this._elem.classList.remove(STATES.success);
    this.valid = false;

    if (this._errorElem && errorText) {
      this._errorElem.innerHTML = errorText;
    }
  }

  validateBy(condition, errorText, n) {
    if (n) {
      errorText = errorText.replace("%n", n);
    }

    if (condition) {
      this.setValid();
    } else {
      this.setInvalid(errorText);
    }
  }

  disable(bool) {
    this._inputElem.disabled = bool;
  }

  // Сброс
  reset() {
    this.valid = true;
    this._elem.classList.remove(STATES.error, STATES.success);
    this._inputElem.value = this.value;
  }

  // Авторесайз для textarea  
  resizeTextarea() {
    const el = this;
    setTimeout(function() {
      el.style.cssText = 'height:auto;';
      el.style.cssText = 'height:' + (el.scrollHeight + 2) + 'px';
    }, 1);
  }
}
