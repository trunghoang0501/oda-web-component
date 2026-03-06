import { TextFieldProps } from '@mui/material';
import { MuiDatePickerProps } from '@/types';

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
