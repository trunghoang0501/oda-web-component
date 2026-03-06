import { DialogProps } from '@mui/material';
import {
  IAddressAreaGeneral,
  IDeliveryAddressItem,
} from 'src/types/delivery-address';
import { AddEditDeliveryAddressEnum } from './constants';

export interface IAddEditDeliveryAddressModalProps extends DialogProps {
  mode?: 'edit' | 'add';
  deliveryAddress?: IDeliveryAddressItem | null;
  showSetDefaultCheckbox?: boolean;
  onCancel: () => void;
  onConfirm: (formData: IAddEditDeliveryAddressForm) => void;
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
