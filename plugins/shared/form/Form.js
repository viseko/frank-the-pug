export default class Form {
  constructor(formElement, options) {
    this.errorClass = options.errorClass || "_error",
    this.successClass = options.successClass || "_success",
    this.awaitClass = options.awaitClass || "_await",
    this.resetAfterSuccess = options.resetAfterSuccess || true,
    this.resetDelay = options.resetDelay || 10000,

    this.onError = options.onError;
    this.onSubmit = options.onSubmit;
    this.onSuccess = options.onSuccess;

    this.form = formElement;

    const fieldNames = [...formElement.querySelectorAll("[name]")].map(field => field.name);
    this.fields = [];
    if (fieldNames.length && formElement.inputFields) {
      this.fields = fieldNames.map(name => formElement.inputFields[name]).filter(Boolean)
    }

    this.form.addEventListener("submit", (event) => {
      this.submitHandler(event);
    });

    this.submitButton = formElement.querySelector("[type='submit']");
    this.submitButton && this.submitButton.addEventListener("click", (event) => {
      this.submitButtonHandler(event);
    });
  }

  submitHandler(event) {
    event.preventDefault();
    this.send();
  }

  submitButtonHandler(event) {
    const isValid = this.validate();

    if (isValid) {
      return true;
    } else {
      event.preventDefault()
    }
  }

  // Валидация формы
  validate() {
    const fields = this.fields;
    fields.forEach(field => field.validate());

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.valid === false) return false;
    }

    return true;
  }

  // Отправка формы
  send() {
    this.setLock(true);
    this.onSubmit && this.onSubmit();

    const form = this.form;
    const url = form.action;
    const formData = new FormData(form);

    fetch(url, {
      method: "POST",
      body: formData,
    }).then(response => response.status)
    .then(status => {
      if (status === 200) {
        this.handleSuccess();
      } else {
        this.handleError();
      }
    }).catch(() => this.handleError())
    .finally(() => this.setLock(false));
  }

  // Включене/отключение режима ожидания
  // * блокировка кнопки и полей ввода
  // * навешивание css-класса ожидания
  setLock(bool) {
    this.submitButton && (this.submitButton.disabled = bool);
    this.fields.forEach(field => {
      field.disabled = bool;
    });
    this.form.classList[bool ? "add" : "remove"](this.awaitClass);
  }

  // Очистка формы
  reset() {
    this.form.reset();
    this.form.querySelectorAll("._success").forEach(elem => elem.classList.remove("_success"));
  }

  // Обработка успешной отправки
  handleSuccess() {
    this.form.classList.add(this.successClass);
    this.onSuccess && this.onSuccess();
    this.reset();
    if (this.resetAfterSuccess && this.resetDelay) {
      setTimeout(() => {
        this.form.classList.remove(this.successClass);
      }, this.resetDelay);
    }
  }

  // Обработка ошибки
  handleError() {
    this.form.classList.add(this.errorClass);
    this.onError && this.onError();
  }
}