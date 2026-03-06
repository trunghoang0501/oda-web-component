import { translate } from '@/i18n/translate';

export enum StatusTabEnum {
  Active = 0,
  Inactive = 1,
}

export const STATUS_TABS = [
  {
    name: translate('active'),
    value: StatusTabEnum.Active,
  },
  {
    name: translate('inactive'),
    value: StatusTabEnum.Inactive,
  },
];

export const PARTNER_STATUS_TAB_CLASS_NAME = 'partnerStatusTab';
