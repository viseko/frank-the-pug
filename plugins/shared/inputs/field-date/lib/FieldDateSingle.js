import AirDatepicker from "air-datepicker";

const options = {
  visible: false,
};

export default class FieldDateSingle {
  constructor(elem) {
    const input = elem.querySelector("[data-role='input']");
    const output = elem.querySelector("[data-role='output']");

    this.input = input;
    this.output = output;
    this.picker = new AirDatepicker(input, {
      ...options,
      onSelect({formattedDate}) {
        output.innerHTML = formattedDate || "";
      }
    });
  }
}