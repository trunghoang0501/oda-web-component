export const getHourList = () => {
  const hourList: number[] = [];

  for (let i = 1; i <= 12; i++) {
    hourList.push(i);
  }

  return hourList;
};

export const getMinuteList = (minuteStep = 5) => {
  const minuteList: number[] = [];

  for (let i = 0; i <= 59; i = i + minuteStep) {
    minuteList.push(i);
  }

  return minuteList;
};
