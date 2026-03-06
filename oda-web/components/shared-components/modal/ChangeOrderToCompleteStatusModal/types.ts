import { ButtonProps, DialogProps } from '@mui/material';
import { DatePickerInputValueType } from '@/types';

export interface IChangeOrderToCompleteStatusModalProps extends DialogProps {
  dateValue: DatePickerInputValueType;
  deliveredDate: DatePickerInputValueType;
  onCancel: () => void;
  onConfirm: (value: DatePickerInputValueType) => void;
  confirmButtonColor?: ButtonProps['color'];
}
