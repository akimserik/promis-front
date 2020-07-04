export function dateToLocalFormat(dateString) {
  const date = new Date(dateString);

  const dateRes =
    ("0" + date.getDate()).slice(-2) +
    "." +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "." +
    date.getFullYear();

  return dateRes;
}
