export default (date) => {
  if (!date) return null;
  const [year, month, day] = date.substr(0, 10).split('-');
  return `${day}.${month}.${year}`;
};
