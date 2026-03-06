import { IAddressAreaGeneral } from '@/types/delivery-address';
import { BoxProps, TextFieldProps } from '@mui/material';

export interface IAreaPickerElementProps {
  name: string;
  boxWrapperProps?: BoxProps;
  textFieldProps?: TextFieldProps;
  countryCode?: string;
}

export interface IAreaPickerElementValue {
  city: {
    id: number | null;
    name: string | null;
  } | null;
  district: {
    id: number | null;
    name: string | null;
  } | null;
}
