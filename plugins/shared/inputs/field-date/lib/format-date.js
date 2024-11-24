export default function formatDate(date) {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
  ];

  if (!date) return null;

  let [d, m, y] = date.split(".").map(val => val.replace(/^0/, ""));
  
  return [d, months[m - 1], y];
}