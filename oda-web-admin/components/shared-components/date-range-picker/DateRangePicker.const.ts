import { RangeShortcutEnum } from '@/constants';
import { translate } from '@/i18n/translate';

export const rangeShortcuts = [
  {
    range: RangeShortcutEnum.AllTime,
    label: translate('all_time'),
  },
  {
    range: RangeShortcutEnum.Yesterday,
    label: translate('yesterday'),
  },
  {
    range: RangeShortcutEnum.Today,
    label: translate('today'),
  },
  {
    range: RangeShortcutEnum.LastWeek,
    label: translate('last_week'),
  },
  {
    range: RangeShortcutEnum.ThisWeek,
    label: translate('this_week'),
  },
  {
    range: RangeShortcutEnum.LastMonth,
    label: translate('last_month'),
  },
  {
    range: RangeShortcutEnum.ThisMonth,
    label: translate('this_month'),
  },
  {
    range: RangeShortcutEnum.Other,
    label: translate('other'),
  },
];
