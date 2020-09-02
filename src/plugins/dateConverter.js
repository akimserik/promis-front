export function dateToLocalFormat(dateString) {
  const date = new Date(dateString);

  const dateRes =
    ('0' + date.getDate()).slice(-2) +
    '.' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '.' +
    date.getFullYear();

  return dateRes;
}

export function formatDate(date) {
  if (!date) return null;
  const [year, month, day] = date.substr(0, 10).split('-');
  return `${day}.${month}.${year}`;
}

export function parseDate(date) {
  if (!date) return null;

  const [day, month, year] = date.split('.');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function startOfWeek(date) {
  var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function getWeekDayName(dateString) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
  const d = new Date(parseDate(dateString));
  return days[d.getDay()];
}
