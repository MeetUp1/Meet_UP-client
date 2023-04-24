export const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayInMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};
