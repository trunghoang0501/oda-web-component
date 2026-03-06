import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangePickerInputValueType } from '@/types';
import { DateRangeUtils } from '@/utils';
import { MyRangeShortcutEnum } from './contants';

interface DateRangeShortcutItem {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface IUseDateRangeShortcutParam {
  value: DateRangePickerInputValueType;
  setValue: Dispatch<SetStateAction<DateRangePickerInputValueType>>;
}

export const useDateRangeShortcut = (params: IUseDateRangeShortcutParam) => {
  const { t } = useTranslation();
  const { value, setValue } = params;

  const dateRangeShortcutList = useMemo<DateRangeShortcutItem[]>(() => {
    const isActiveAllTime = DateRangeUtils.isAllDateRange(value);
    const isActiveYesterday = DateRangeUtils.isYesterdayDateRange(value);
    const isActiveToday = DateRangeUtils.isTodayDateRange(value);
    const isActiveLastWeek = DateRangeUtils.isLastWeekDateRange(value);
    const isActiveThisWeek = DateRangeUtils.isThisWeekDateRange(value);
    const isActiveLastMonth = DateRangeUtils.isLastMonthDateRange(value);
    const isActiveThisMonth = DateRangeUtils.isThisMonthDateRange(value);
    const isActiveOther =
      !isActiveAllTime &&
      !isActiveYesterday &&
      !isActiveToday &&
      !isActiveLastWeek &&
      !isActiveThisWeek &&
      !isActiveLastMonth &&
      !isActiveThisMonth;

    return [
      {
        id: MyRangeShortcutEnum.AllTime,
        label: t('all_time'),
        isActive: isActiveAllTime,
        onClick: () => {
          const newValue = DateRangeUtils.getAllDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.Yesterday,
        label: t('yesterday'),
        isActive: isActiveYesterday,
        onClick: () => {
          const newValue = DateRangeUtils.getYesterdayDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.Today,
        label: t('today'),
        isActive: isActiveToday,
        onClick: () => {
          const newValue = DateRangeUtils.getTodayDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.LastWeek,
        label: t('last_week'),
        isActive: isActiveLastWeek,
        onClick: () => {
          const newValue = DateRangeUtils.getLastWeekDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.ThisWeek,
        label: t('this_week'),
        isActive: isActiveThisWeek,
        onClick: () => {
          const newValue = DateRangeUtils.getThisWeekDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.LastMonth,
        label: t('last_month'),
        isActive: isActiveLastMonth,
        onClick: () => {
          const newValue = DateRangeUtils.getLastMonthDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.ThisMonth,
        label: t('this_month'),
        isActive: isActiveThisMonth,
        onClick: () => {
          const newValue = DateRangeUtils.getThisMonthDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.Other,
        label: t('other'),
        isActive: isActiveOther,
        onClick: () => {},
      },
    ];
  }, [value]);

  return dateRangeShortcutList;
};
