import { TextFieldProps } from '@mui/material';
import { DatePickerInputValueType, MuiDatePickerProps } from '@/types';

export interface IMyDateTimePickerProps {
  value: DatePickerInputValueType;
  onChange: (value: DatePickerInputValueType) => void;
  minuteStep?: number;
  removeEnable?: boolean; // Allow clearing the date value
  datePickerProps?: Omit<
    MuiDatePickerProps,
    | 'value'
    | 'onChange'
    | 'renderInput'
    | 'onClose'
    | 'open'
    | 'value'
    | 'closeOnSelect'
  >;
  textFieldProps?: TextFieldProps;
}
