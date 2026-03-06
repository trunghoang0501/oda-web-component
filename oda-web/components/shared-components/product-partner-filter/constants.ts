import { translate } from '@/i18n/translate';
import { IPartnerFilterValue } from './types';

export enum PartnerTabEnum {
  Local = 0,
  Linked = 1,
}

export const STATUS_TABS = [
  {
    value: PartnerTabEnum.Local,
    name: translate('local'),
  },
  {
    value: PartnerTabEnum.Linked,
    name: translate('linked'),
  },
];

export const LOCAL_AND_LINKED_PARTNER_TAB_CLASS_NAME =
  'localAndLinkedPartnerTab';

export const DEFAULT_PARTNER_FILTER_VALUE: IPartnerFilterValue = {
  localSupplierSelected: [],
  linkedPartnerSelected: [],
};
