import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangePickerInputValueType } from '@/types';
import { DateRangeUtils } from '@/utils';
import { MyRangeShortcutEnum } from './constants';

interface DateRangeShortcutItem {
  id: string;
  label: string;
  isActive: boolean;
  isShow: boolean;
  minDate?: string | Dayjs | Date | null;
  maxDate?: string | Dayjs | Date | null;
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
    const isActiveThisYear = DateRangeUtils.isThisYearDateRange(value);
    const isActiveOther =
      !isActiveAllTime &&
      !isActiveYesterday &&
      !isActiveToday &&
      !isActiveLastWeek &&
      !isActiveThisWeek &&
      !isActiveLastMonth &&
      !isActiveThisMonth &&
      !isActiveThisYear;

    return [
      {
        id: MyRangeShortcutEnum.AllTime,
        label: t('all_time'),
        isActive: isActiveAllTime,
        isShow: true,
        onClick: () => {
          const newValue = DateRangeUtils.getAllDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.ThisMonth,
        label: t('this_month'),
        isActive: isActiveThisMonth,
        minDate: DateRangeUtils.getThisMonthDateRange()[0],
        maxDate: DateRangeUtils.getThisMonthDateRange()[1],
        isShow: true,
        onClick: () => {
          const newValue = DateRangeUtils.getThisMonthDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.LastMonth,
        label: t('last_month'),
        isActive: isActiveLastMonth,
        minDate: DateRangeUtils.getLastMonthDateRange()[0],
        maxDate: DateRangeUtils.getLastMonthDateRange()[1],
        isShow: true,
        onClick: () => {
          const newValue = DateRangeUtils.getLastMonthDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.ThisWeek,
        label: t('this_week'),
        isActive: isActiveThisWeek,
        minDate: DateRangeUtils.getThisWeekDateRange()[0],
        maxDate: DateRangeUtils.getThisWeekDateRange()[1],
        isShow: true,
        onClick: () => {
          const newValue = DateRangeUtils.getThisWeekDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.LastWeek,
        label: t('last_week'),
        isActive: isActiveLastWeek,
        minDate: DateRangeUtils.getLastWeekDateRange()[0],
        maxDate: DateRangeUtils.getLastWeekDateRange()[1],
        isShow: true,
        onClick: () => {
          const newValue = DateRangeUtils.getLastWeekDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.Yesterday,
        label: t('yesterday'),
        isActive: isActiveYesterday,
        minDate: DateRangeUtils.getYesterdayDateRange()[0],
        maxDate: DateRangeUtils.getYesterdayDateRange()[1],
        isShow: true,
        onClick: () => {
          const newValue = DateRangeUtils.getYesterdayDateRange();
          setValue(newValue);
        },
      },
      {
        id: MyRangeShortcutEnum.Today,
        label: t('today'),
        isActive: isActiveToday,
        minDate: DateRangeUtils.getTodayDateRange()[0],
        maxDate: DateRangeUtils.getTodayDateRange()[1],
        isShow: true,
        onClick: () => {
          const newValue = DateRangeUtils.getTodayDateRange();
          setValue(newValue);
        },
      },
      // {
      //   id: MyRangeShortcutEnum.ThisYear,
      //   label: t('this_year'),
      //   isActive: isActiveThisYear,
      //   minDate: DateRangeUtils.getThisYearDateRange()[0],
      //   maxDate: DateRangeUtils.getThisYearDateRange()[1],
      //   isShow: false,
      //   onClick: () => {
      //     const newValue = DateRangeUtils.getThisYearDateRange();
      //     setValue(newValue);
      //   },
      // },
      {
        id: MyRangeShortcutEnum.Other,
        label: t('pick_a_date_range'),
        isActive: isActiveOther,
        isShow: true,
        onClick: () => {
          const newValue = DateRangeUtils.getTomorrowDateRange();
          setValue(newValue);
        },
      },
    ];
  }, [value]);

  return dateRangeShortcutList;
};
