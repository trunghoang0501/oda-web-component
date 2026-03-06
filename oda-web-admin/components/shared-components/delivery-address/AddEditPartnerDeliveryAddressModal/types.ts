import { DialogProps } from '@mui/material';
import {
  IAddressAreaGeneral,
  IDeliveryAddressRequest,
  IPartnerDeliveryAddress,
} from 'src/types/delivery-address';
import { AddEditPartnerDeliveryAddressEnum } from './constants';

export interface IPartnerDeliveryAddressRequest
  extends IDeliveryAddressRequest {
  delivery_fee: number;
}

export interface IArea {
  city: IAddressAreaGeneral;
  district: IAddressAreaGeneral;
}

export interface IAddEditPartnerDeliveryAddressModalProps extends DialogProps {
  mode?: 'edit' | 'add';
  deliveryAddress?: IPartnerDeliveryAddress;
  statusPartnerIsLink: boolean;
  showSetDefaultCheckbox?: boolean;
  onCancel: () => void;
  onConfirm: (formData: IAddEditPartnerDeliveryAddressForm) => void;
}

export interface IAddEditPartnerDeliveryAddressForm {
  [AddEditPartnerDeliveryAddressEnum.Name]: string;
  [AddEditPartnerDeliveryAddressEnum.Mobile]: string;
  [AddEditPartnerDeliveryAddressEnum.Area]: IArea;
  [AddEditPartnerDeliveryAddressEnum.Address]: string;
  [AddEditPartnerDeliveryAddressEnum.IsDefault]: boolean;
  [AddEditPartnerDeliveryAddressEnum.DeliveryFee]: number;
}
