import { translate } from '@/i18n/translate';

export const RangeShortcut = {
  allTime: 'allTime',
  today: 'today',
  thisMonth: 'thisMonth',
  previousMonth: 'previousMonth',
  other: 'other',
  lastMonth: 'lastMonth',
  thisWeek: 'thisWeek',
  lastWeek: 'lastWeek',
  thisYear: 'thisYear',
  yesterday: 'yesterday',
};

export type RangeShortcutType = keyof typeof RangeShortcut;

export const rangeShortcuts = [
  {
    range: RangeShortcut.allTime,
    label: translate('all_time'),
  },
  {
    range: RangeShortcut.today,
    label: translate('today'),
  },
  {
    range: RangeShortcut.thisMonth,
    label: translate('this_month'),
  },
  {
    range: RangeShortcut.previousMonth,
    label: translate('previous_month'),
  },
  {
    range: RangeShortcut.other,
    label: translate('pick_a_date_range'),
  },
];
