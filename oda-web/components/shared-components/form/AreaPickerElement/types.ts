import { BoxProps, TextFieldProps } from '@mui/material';
import { IAddressAreaGeneral } from '@/types/delivery-address';

export interface IAreaPickerElementProps {
  name: string;
  boxWrapperProps?: Pick<BoxProps, 'sx'>;
  textFieldProps?: Omit<TextFieldProps, 'onFocus' | 'onChange'>;
}

export interface IAreaPickerElementValue {
  city: IAddressAreaGeneral | null;
  district: IAddressAreaGeneral | null;
}
