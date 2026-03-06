import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersSlotsComponent } from '@mui/x-date-pickers/internals/components/wrappers/WrapperProps';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'debounce';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useLocale from '@/hooks/useLocale';
import useMobileDetect from '@/hooks/useMobileDetect';
import {
  DateRangePickerInputValueType,
  MuiDateRangePickerProps,
} from '@/types';
import {
  DATE_FORMAT_YYYY_MM_DD,
  DateRangeUtils,
  dayOfWeekFormatter,
  formatDate,
  hexToRGBA,
} from '@/utils';
import { MyRangeShortcutEnum } from './constants';
import { IMyDateRangePickerProps } from './types';
import { useDateRangeShortcut } from './useDateRangeShortcut';

const MyDateRangePicker = (props: IMyDateRangePickerProps) => {
  const {
    value: propValue,
    setValue: propSetValue,
    initialValue = [null, null],
    showShortcutPanel = true,
    renderInput: propRenderInput,
    textFieldProps = {},
    dateRangePickerProps = {},
    isCustomDateRangeShortcut = false,
    focusMinMaxDateRange = false,
    tooltipContent,
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const mobileDetect = useMobileDetect();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [hasChangedValue, setHasChangedValue] = useState(false);
  const [dateValue, setDateValue] = useState<DateRangePickerInputValueType>(
    () => {
      if (propValue) {
        return propValue;
      }

      return initialValue;
    }
  );

  const dateRangeShortcutList = useDateRangeShortcut({
    value: dateValue,
    setValue: setDateValue,
  });

  const processedDateRangeShortcutList = useMemo(() => {
    if (isCustomDateRangeShortcut) {
      return dateRangeShortcutList.map((rangeItem) => {
        if (rangeItem.id === MyRangeShortcutEnum.AllTime) {
          return {
            ...rangeItem,
            isShow: false,
          };
        }

        if (rangeItem.id === MyRangeShortcutEnum.ThisYear) {
          return {
            ...rangeItem,
            isShow: true,
          };
        }

        return rangeItem;
      });
    }

    return dateRangeShortcutList;
  }, [isCustomDateRangeShortcut, dateRangeShortcutList]);

  const locale = useLocale();

  useEffect(() => {
    if (propValue) {
      setDateValue(propValue);
    }
  }, [propValue[0], propValue[1]]);

  const handleOpen = () => {
    setOpenDatePicker(true);
  };

  /*
    Fixing auto close popover when use touchpad macos change date
  */
  const handleDateChange = useCallback(
    debounce((newValue: DateRangePickerInputValueType) => {
      setDateValue(newValue);
    }, 50),
    []
  );

  const handleReset = () => {
    setDateValue(initialValue);
  };

  const getCurrentPageOptionValue = useMemo(() => {
    let value = MyRangeShortcutEnum.Other;
    if (DateRangeUtils.isAllDateRange(propValue)) {
      value = MyRangeShortcutEnum.AllTime;
    }
    if (DateRangeUtils.isThisYearDateRange(propValue)) {
      value = MyRangeShortcutEnum.ThisYear;
    }
    if (DateRangeUtils.isYesterdayDateRange(propValue)) {
      value = MyRangeShortcutEnum.Yesterday;
    }
    if (DateRangeUtils.isTodayDateRange(propValue)) {
      value = MyRangeShortcutEnum.Today;
    }
    if (DateRangeUtils.isLastWeekDateRange(propValue)) {
      value = MyRangeShortcutEnum.LastWeek;
    }
    if (DateRangeUtils.isThisWeekDateRange(propValue)) {
      value = MyRangeShortcutEnum.ThisWeek;
    }
    if (DateRangeUtils.isLastMonthDateRange(propValue)) {
      value = MyRangeShortcutEnum.LastMonth;
    }
    if (DateRangeUtils.isThisMonthDateRange(propValue)) {
      value = MyRangeShortcutEnum.ThisMonth;
    }
    return value;
  }, [propValue]);
  const handleClose = () => {
    setOpenDatePicker(false);
    setDateValue(propValue);
    setSelectedOptionValue(getCurrentPageOptionValue);
  };

  const handleAccept = () => {
    setOpenDatePicker(false);
    propSetValue(dateValue);
    handleClose();
  };
  const [currentFilterType, setCurrentFilterType] = useState(
    processedDateRangeShortcutList.find((rangeItem) => rangeItem.isActive)
  );

  const PaperContentCustom = useCallback(
    (_: { children: ReactNode }) => {
      return <></>;
    },
    [dateValue, showShortcutPanel]
  );

  const ActionBarCustom = useCallback<
    PickersSlotsComponent['ActionBar']
  >(() => {
    if (!mobileDetect.isMobileWithoutScreenSize()) {
      if (currentFilterType?.id !== MyRangeShortcutEnum.Other) {
        return <></>;
      }
    }

    return (
      <Box
        sx={{
          display:
            currentFilterType?.id === MyRangeShortcutEnum.Other
              ? 'flex'
              : 'none',
          alignItems: 'center',
          borderTop: `1px solid ${hexToRGBA(theme.palette.common.black, 0.12)}`,
          p: 4,
          mt: 4,
        }}
      >
        <Box
          sx={{
            cursor: 'pointer',
            px: 2,
            py: 1.5,
            color: theme.palette.error.dark,
          }}
          onClick={handleReset}
        >
          {t('reset')}
        </Box>

        <Box
          sx={{
            cursor: 'pointer',
            ml: 'auto',
            px: 2,
            py: 1.5,
            color: theme.palette.text.secondary,
          }}
          onClick={handleClose}
        >
          {t('cancel')}
        </Box>

        <Box
          sx={{
            cursor: 'pointer',
            px: 2,
            py: 1.5,
            ml: 6,
            color: theme.palette.info.main,
          }}
          onClick={handleAccept}
        >
          {t('question:ok')}
        </Box>
      </Box>
    );
  }, [dateValue]);

  const renderInput = useCallback<MuiDateRangePickerProps['renderInput']>(
    (startProps) => {
      const inputValue = (() => {
        return '';
      })();
      const arrTextFieldProps: TextFieldProps[] = [
        startProps,
        {
          label: '',
          InputProps: {
            endAdornment: (
              <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                <CalendarTodayOutlinedIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: theme.spacing(5.5),
                  }}
                />
              </InputAdornment>
            ),
            sx: {
              cursor: 'pointer',
              height: theme.spacing(10),
            },
          },
          inputProps: {
            readOnly: true,
            placeholder: t('all_time'),
            value: inputValue,
            sx: {
              '&::placeholder': {
                color: `${theme.palette.text.primary} !important`,
              },
            },
          },
          fullWidth: true,
          onFocus: handleOpen,
        },
        textFieldProps,
      ];

      return <TextField {...deepmerge.all(arrTextFieldProps)} />;
    },
    [dateValue, hasChangedValue, textFieldProps]
  );

  const combinedDateRangePickerProp: Exclude<
    IMyDateRangePickerProps['dateRangePickerProps'],
    undefined
  >[] = [
    {
      PaperProps: {
        sx: {
          '& .MuiDateRangePickerViewDesktop-container:first-of-type': {
            borderRight: `1px solid ${hexToRGBA(
              theme.palette.common.black,
              0.12
            )}`,
          },
          '& .MuiTypography-subtitle1': {
            fontWeight: 600,
            textTransform: 'capitalize',
          },
        },
      },
      inputFormat: DATE_FORMAT_YYYY_MM_DD,
    },
    dateRangePickerProps,
  ];

  // I need to function maxDate follow processedDateRangeShortcutList to disable date range
  const maxDate = useMemo(() => {
    if (focusMinMaxDateRange) {
      const maxDateItem = processedDateRangeShortcutList.find(
        (rangeItem) => rangeItem.isActive
      );

      if (maxDateItem) {
        return maxDateItem.maxDate;
      }
    }

    return undefined;
  }, [processedDateRangeShortcutList]);

  // I need to function minDate follow processedDateRangeShortcutList to disable date range
  const minDate = useMemo(() => {
    if (focusMinMaxDateRange) {
      const maxDateItem = processedDateRangeShortcutList.find(
        (rangeItem) => rangeItem.isActive
      );

      if (maxDateItem) {
        return maxDateItem.minDate;
      }
    }

    return undefined;
  }, [processedDateRangeShortcutList]);

  // I need to function maxDateOtherRange follow processedDateRangeShortcutList to disable date range
  const maxDateOtherRange = useMemo(() => {
    if (focusMinMaxDateRange) {
      const maxDateItem = processedDateRangeShortcutList.find(
        (rangeItem) => rangeItem.isActive
      );

      if (maxDateItem && maxDateItem.id === MyRangeShortcutEnum.Other) {
        return DateRangeUtils.getNext90Days(dateValue[0] || new Date())[1];
      }
    }

    return undefined;
  }, [processedDateRangeShortcutList, dateValue[0]]);
  const [optionValue] = useState('');
  const [selectedOptionValue, setSelectedOptionValue] = useState(
    MyRangeShortcutEnum.AllTime
  );

  useEffect(() => {
    setSelectedOptionValue(getCurrentPageOptionValue);
  }, [propValue]);
  const [isOpenSelectTimeRange, setIsSelectTimeRange] = useState(false);
  const handleOpenTimeRange = () => {
    setIsSelectTimeRange(true);
  };
  const handleCloseTimeRange = () => {
    setIsSelectTimeRange(false);
  };
  const handleChooseOther = () => {
    setTestOpenDesktop(true);
  };
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs(propValue[0] ?? DateRangeUtils.getTodayDateRange()[0]),
    dayjs(propValue[1] ?? DateRangeUtils.getTodayDateRange()[1]),
  ]);
  const [testOpenDesktop, setTestOpenDesktop] = useState(false);

  // Sync desktop DateRangePicker value with propValue so "Pick a date range"
  // displays the same range as the shortcut (e.g. "This month" → 1st to 31st)
  useEffect(() => {
    if (propValue?.[0] && propValue?.[1]) {
      setValue([dayjs(propValue[0]), dayjs(propValue[1])]);
    }
  }, [propValue[0], propValue[1]]);

  const PaperContentWithTooltip = useCallback(
    (paperContentProps: { children?: ReactNode }) => (
      <>
        {tooltipContent && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              px: 2,
              py: 1.5,
              borderRadius: 1,
              bgcolor: 'grey.100',
              border: (sxTheme) => `1px solid ${sxTheme.palette.grey[300]}`,
              mx: 2,
              mt: 2,
            }}
          >
            {tooltipContent}
          </Box>
        )}
        {paperContentProps.children}
      </>
    ),
    [tooltipContent]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <Box>
        <Box>
          <Select
            sx={{
              width: '100%',
              minHeight: 0,
              '& > div': {
                p: `${theme.spacing(2)} ${theme.spacing(2)} !important`,
              },
            }}
            onOpen={handleOpenTimeRange}
            onClose={handleCloseTimeRange}
            value={isOpenSelectTimeRange ? optionValue : selectedOptionValue}
            onChange={(event: SelectChangeEvent) => {
              const newValue = event.target.value;
              setSelectedOptionValue(newValue as MyRangeShortcutEnum);
              processedDateRangeShortcutList.forEach((rangeItem) => {
                if (rangeItem.id === newValue) {
                  let rangeValue: [any, any];
                  switch (newValue) {
                    case MyRangeShortcutEnum.AllTime:
                      rangeValue = DateRangeUtils.getAllDateRange();
                      setOpenDatePicker(false);
                      break;
                    case MyRangeShortcutEnum.ThisYear:
                      rangeValue = DateRangeUtils.getThisYearDateRange();
                      setOpenDatePicker(false);
                      break;
                    case MyRangeShortcutEnum.Yesterday:
                      rangeValue = DateRangeUtils.getYesterdayDateRange();
                      setOpenDatePicker(false);
                      break;
                    case MyRangeShortcutEnum.Today:
                      rangeValue = DateRangeUtils.getTodayDateRange();
                      setOpenDatePicker(false);
                      break;
                    case MyRangeShortcutEnum.LastWeek:
                      rangeValue = DateRangeUtils.getLastWeekDateRange();
                      setOpenDatePicker(false);
                      break;
                    case MyRangeShortcutEnum.ThisWeek:
                      rangeValue = DateRangeUtils.getThisWeekDateRange();
                      setOpenDatePicker(false);
                      break;
                    case MyRangeShortcutEnum.LastMonth:
                      rangeValue = DateRangeUtils.getLastMonthDateRange();
                      setOpenDatePicker(false);
                      break;
                    case MyRangeShortcutEnum.ThisMonth:
                      rangeValue = DateRangeUtils.getThisMonthDateRange();
                      setOpenDatePicker(false);
                      break;
                    case MyRangeShortcutEnum.Other:
                      rangeValue = propValue;
                      setOpenDatePicker(true);
                      break;
                    default:
                      rangeValue = propValue;
                      setOpenDatePicker(false);
                  }
                  propSetValue(rangeValue);
                  setDateValue(rangeValue);
                  rangeItem.onClick();
                  setCurrentFilterType(rangeItem);
                  setHasChangedValue(true);
                  handleCloseTimeRange();
                  if (rangeItem.id === MyRangeShortcutEnum.Other) {
                    handleChooseOther();
                  }
                }
              });
            }}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem className="tmpItemDatePicker" key="tmp_item" value="">
              &nbsp;
            </MenuItem>
            {processedDateRangeShortcutList.map((rangeItem) => {
              if (!rangeItem.isShow) {
                return null;
              }
              const displayValue =
                testOpenDesktop && rangeItem.id === MyRangeShortcutEnum.Other
                  ? value
                  : dateValue;
              return (
                <MenuItem key={rangeItem.id} value={rangeItem.id}>
                  {!isOpenSelectTimeRange &&
                  rangeItem.id === MyRangeShortcutEnum.Other &&
                  !DateRangeUtils.isAllDateRange(displayValue)
                    ? `${formatDate(displayValue[0])} to ${formatDate(
                        displayValue[1]
                      )}`
                    : rangeItem.label}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
        {!mobileDetect.isMobileWithoutScreenSize() && (
          <Box
            sx={{
              height: theme.spacing(0.25),
              visibility: 'hidden',
            }}
          >
            <DateRangePicker
              open={testOpenDesktop}
              onOpen={() => setTestOpenDesktop(true)}
              onClose={() => setTestOpenDesktop(false)}
              value={value}
              maxDate={maxDate! || maxDateOtherRange!}
              minDate={minDate!}
              onChange={(newValue) => {
                propSetValue(newValue as DateRangePickerInputValueType);
                setDateValue(newValue as DateRangePickerInputValueType);
                setHasChangedValue(true);
                setValue(newValue as DateRange<Dayjs>);
              }}
              onAccept={(newValue) => {
                if (newValue[0] && newValue[1]) {
                  propSetValue(newValue as DateRangePickerInputValueType);
                  setDateValue(newValue as DateRangePickerInputValueType);
                  setValue(newValue as DateRange<Dayjs>);
                }
              }}
              renderInput={renderInput}
              {...(tooltipContent && {
                components: { PaperContent: PaperContentWithTooltip },
              })}
            />
          </Box>
        )}
        {mobileDetect.isMobileWithoutScreenSize() && (
          <Box
            sx={{
              display: openDatePicker ? 'block' : 'none',
              height: 1,
              visibility: 'hidden',
            }}
          >
            <DateRangePicker
              value={dateValue}
              open={openDatePicker}
              onChange={handleDateChange}
              onClose={handleClose}
              closeOnSelect={false}
              maxDate={maxDate! || maxDateOtherRange!}
              minDate={minDate!}
              components={{
                PaperContent: PaperContentCustom,
                ActionBar: ActionBarCustom,
              }}
              renderInput={propRenderInput || renderInput}
              {...deepmerge.all(combinedDateRangePickerProp, {
                isMergeableObject: isPlainObject,
              })}
              dayOfWeekFormatter={(day) => dayOfWeekFormatter(day, locale)}
            />
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export type { IMyDateRangePickerProps } from './types';
export default MyDateRangePicker;
