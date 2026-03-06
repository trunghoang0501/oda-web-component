import { DialogProps } from '@mui/material';
import {
  IAddressAreaGeneral,
  IDeliveryAddress,
} from '@/types/delivery-address';
import { AddEditDeliveryAddressEnum } from './constants';

export interface IAddEditDeliveryAddressModalProps extends DialogProps {
  mode?: 'edit' | 'add';
  deliveryAddress?: IDeliveryAddress | null;
  onCancel: () => void;
  onConfirm: (formData: IAddEditDeliveryAddressForm) => void;
  showSetDefaultCheckbox?: boolean;
  setDefaultDeliveryAddress?: boolean;
  colorTheme?: string;
}

export interface IArea {
  city: IAddressAreaGeneral;
  district: IAddressAreaGeneral;
}

export interface IAddEditDeliveryAddressForm {
  [AddEditDeliveryAddressEnum.Name]: string;
  [AddEditDeliveryAddressEnum.Mobile]: string;
  [AddEditDeliveryAddressEnum.Area]: IArea;
  [AddEditDeliveryAddressEnum.Address]: string;
  [AddEditDeliveryAddressEnum.IsDefault]: boolean;
}
