import { MuiDatePickerProps } from '@/types';
import { TextFieldProps } from '@mui/material';

export interface IMyDateTimePickerElementProps {
  name: string;
  minuteStep?: number;
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
