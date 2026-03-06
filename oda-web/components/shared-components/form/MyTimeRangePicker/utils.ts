import { MY_TIME_RANGE_PICKER_TYPE, TMyTimeRangePickerValue } from './types';

interface IConvertToMyTimeRangePickerValueParams {
  timeRangeId?: number | null;
  exactTime?: string | null; // string format hh:mm:ss
}

export const convertToMyTimeRangePickerValue = (
  params?: IConvertToMyTimeRangePickerValueParams
): TMyTimeRangePickerValue => {
  if (params?.timeRangeId) {
    return {
      type: MY_TIME_RANGE_PICKER_TYPE.TimeRange,
      value: params.timeRangeId,
    };
  }

  if (params?.exactTime) {
    return {
      type: MY_TIME_RANGE_PICKER_TYPE.ExactTime,
      value: params.exactTime,
    };
  }

  return null;
};

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
