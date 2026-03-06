import { DialogProps } from '@mui/material';

export interface IShipperItem {
  id: number;
  name: string;
  phone: string;
}

export interface IShipperValue {
  name: string;
  phone: string;
}

export interface IChangeShipperContactModalProps extends DialogProps {
  shipperList?: IShipperItem[];
  shipper?: IShipperValue;
  onCancel: () => void;
  onConfirm: (value: IShipperValue, formData: IShipperContactForm) => void;
}

export enum ShipperContactFieldsEnum {
  Shipper = 'shipper',
  Phone = 'phone',
}

export interface IShipperContactForm {
  [ShipperContactFieldsEnum.Shipper]: IShipperItem | null;
  [ShipperContactFieldsEnum.Phone]: string | null;
}
