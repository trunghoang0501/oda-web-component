import { translate } from '@/i18n/translate';
import { IAreaPickerElementValue } from './types';

export enum AddressPickerTabEnum {
  City = 0,
  District = 1,
}

export const initialValue: IAreaPickerElementValue = {
  city: null,
  district: null,
};

export const addressPickerTabs = [
  {
    value: AddressPickerTabEnum.City,
    name: translate('city'),
  },
  {
    value: AddressPickerTabEnum.District,
    name: translate('district'),
  },
];
