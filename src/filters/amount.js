export default (value) => {
  const amount = new Number(value);
  return amount.toLocaleString();
};
