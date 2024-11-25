import AirDatepicker from "air-datepicker";
import formatDate from "./format-date.js";

const options = {
  visible: false,
  range: true,
  multipleDatesSeparator: " — ",
};

export default class InputDate {
  constructor(elem) {
    const input = elem.querySelector("[data-role='input']");
    const output = elem.querySelector("[data-role='output']");

    const field = this;

    this.input = input;
    this.output = output;
    this.picker = new AirDatepicker(input, {
      ...options,
      onSelect({formattedDate}) {
        const [from, to] = formattedDate;
        field.render(from, to);
      }
    });

    // Проверка значения, если дата не установлена, устанавливаем диапазон этого месяца
    let value = input.value;
    let dates = value.split("-");
    let startDate = null;
    let endDate = null;

    if (dates.length < 2) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 1);
    } else {
      startDate = strToDate(dates[0])
      endDate = strToDate(dates[1])
    }

    this.picker.selectDate([startDate, endDate]);
  }

  render(from, to) {
    const dateFrom = formatDate(from);
    const dateTo = formatDate(to);

    if (dateFrom && dateTo && dateFrom[2] === dateTo[2]) {
      dateFrom.pop();
    }

    const strFrom = dateFrom ? dateFrom.join(" ") : "...";
    const strTo = dateTo ? dateTo.join(" ") : "...";

    const formattedString = `${strFrom}${options.multipleDatesSeparator}${strTo}`
    this.output.innerHTML = formattedString;
    this.input.value = `${strFrom}-${strTo}`;
  }
}