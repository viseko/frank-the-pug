export default function strToDate(str) {
  // * str = dd.mm.yyyy
  return str.split(".").reverse().join("-");
}