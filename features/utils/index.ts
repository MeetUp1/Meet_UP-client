export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayInMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};
