import {
  DateRangePickerInputValueType,
  MuiDateRangePickerProps,
} from '@/types';
import { TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';

export interface IMyDateRangePickerProps {
  value: DateRangePickerInputValueType;
  setValue: (
    value: DateRangePickerInputValueType
  ) => void | DateRangePickerInputValueType;
  showShortcutPanel?: boolean;
  /** 
    If you provide data for this field, when the user press "reset" button,
    the value of the date picker will return to value of this field
  */
  initialValue?: DateRangePickerInputValueType;
  renderInput?: MuiDateRangePickerProps['renderInput'];
  textFieldProps?: TextFieldProps;
  dateRangePickerProps?: Pick<
    MuiDateRangePickerProps,
    'PaperProps' | 'inputFormat' | 'maxDate' | 'minDate'
  >;
  paperContent?: ReactNode;
}
