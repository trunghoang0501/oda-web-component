import { BoxProps, TextFieldProps } from '@mui/material';
import { ITimeRangeItem } from '@/types/time-range';

export enum TabEnum {
  TimeRange = 0,
  ExactTime = 1,
}

export const MY_TIME_RANGE_PICKER_TYPE = {
  TimeRange: 'timeRange',
  ExactTime: 'exactTime',
} as const;

export type TMyTimeRangePickerType =
  | typeof MY_TIME_RANGE_PICKER_TYPE
  | typeof MY_TIME_RANGE_PICKER_TYPE.ExactTime;

export type TMyTimeRangePickerValue =
  | null
  | undefined
  | {
      type: typeof MY_TIME_RANGE_PICKER_TYPE.TimeRange;
      value: number; // range item id
    }
  | {
      type: typeof MY_TIME_RANGE_PICKER_TYPE.ExactTime;
      value: string; // format hh:mm
    };

export interface ITextFieldPorps {
  sx?: TextFieldProps['sx'];
  error?: TextFieldProps['error'];
  label?: TextFieldProps['label'];
  placeholder?: TextFieldProps['placeholder'];
  InputLabelProps?: TextFieldProps['InputLabelProps'];
  inputProps?: TextFieldProps['inputProps'];
  helperText?: TextFieldProps['helperText'];
  InputProps?: Omit<TextFieldProps['InputProps'], 'onClick'>;
}

export interface IMyTimeRangePickerProps {
  /*
    - number is id for `Time Range` select list
    - string for `Exact Time`
    - null | undefined for not selected
  */
  value: TMyTimeRangePickerValue;
  onChange: (value: NonNullable<TMyTimeRangePickerValue>) => void;
  timeRangeList: ITimeRangeItem[];
  disabled?: boolean;
  minuteStep?: number;
  boxWrapperProps?: BoxProps;
  textFieldProps?: ITextFieldPorps;
}
