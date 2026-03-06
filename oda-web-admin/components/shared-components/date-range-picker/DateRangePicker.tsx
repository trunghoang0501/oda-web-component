import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRange,
  DateRangePicker as DateRangePickerMui,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { Box, InputAdornment, Radio, Stack, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import { useSettings } from '@/hooks/useSettings';
import { CustomActionBar } from '@/components/shared-components/date-range-picker/components/CustomActionBar';
import { rangeShortcuts } from '@/components/shared-components/date-range-picker/DateRangePicker.const';
import { RangeShortcutEnum } from '@/constants';
import Typography from '@mui/material/Typography';
import {
  DATE_FORMAT_DD_MMM_YYYY_SLASH,
  formatDate,
  adapterLocaleByLang,
  dayOfWeekFormatter,
} from '@/utils';
import { MuiTextFieldProps } from '@mui/x-date-pickers/internals';

const DateRangePickerMuiStyled = styled(DateRangePickerMui)(() => ({
  '& .MuiTypography-root': {
    fontWeight: '600',
  },
}));

const DateRangePickerComponent = ({
  paperContent,
  value: valueProps,
  range: rangeProps = RangeShortcutEnum.Other,
  open: openProps = false,
  showTerm = true,
  showRangeShortcutsPanel = false,
  ...props
}: Partial<Omit<DateRangePickerProps<any, any>, 'onChange'>> & {
  paperContent?: JSX.Element;
  range?: RangeShortcutEnum;
  onClear?: () => void;
  onCancel?: () => void;
  onAccept?: () => void;
  open?: boolean;
  showTerm?: boolean;
  onChange?: (value: DateRange<any>, range: RangeShortcutEnum) => void;
  showRangeShortcutsPanel?: boolean;
}) => {
  const [t] = useTranslation();
  const theme = useTheme();
  const { settings } = useSettings();

  const [value, setValue] = React.useState<any>([null, null]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [currentRange, setCurrentRange] = React.useState<RangeShortcutEnum>(
    RangeShortcutEnum.AllTime
  );

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  useEffect(() => {
    if (rangeProps) {
      if (!rangeProps || rangeProps === RangeShortcutEnum.AllTime) {
        setValue([null, null]);
      } else {
        setValue([
          valueProps?.[0] ?? value?.[0] ?? null,
          valueProps?.[1] ?? value?.[1] ?? null,
        ]);
      }
    }
  }, [valueProps]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (rangeProps) {
        setCurrentRange(rangeProps);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [rangeProps]);

  const buildHandleRangeClick =
    (_setValue: React.Dispatch<React.SetStateAction<DateRange<Dayjs>>>) =>
    (range: RangeShortcutEnum) => {
      const today = dayjs();
      setCurrentRange(range);
      switch (range) {
        case RangeShortcutEnum.AllTime:
          _setValue([null, null]);
          break;
        case RangeShortcutEnum.Yesterday:
          _setValue([today.subtract(1, 'day'), today.subtract(1, 'day')]);
          break;
        case RangeShortcutEnum.Today:
          _setValue([today.subtract(0, 'day'), today]);
          break;
        case RangeShortcutEnum.LastWeek:
          _setValue([today.day(-6), today.day(0)]);
          break;
        case RangeShortcutEnum.ThisWeek:
          _setValue([today.day(1), today.day(7)]);
          break;
        case RangeShortcutEnum.LastMonth:
          _setValue([
            today.add(-1, 'month').startOf('month'),
            today.add(-1, 'month').endOf('month'),
          ]);
          break;
        case RangeShortcutEnum.ThisMonth:
          _setValue([today.startOf('month'), today.endOf('month')]);
          break;
        default:
          _setValue([null, null]);
          break;
      }
    };

  const staticRangeShortcutsPanel = useCallback(
    ({
      children,
      ...other
    }: {
      setValue?: React.Dispatch<React.SetStateAction<DateRange<Dayjs>>>;
      children: React.ReactNode;
    }) => {
      const handleRangeClick = React.useCallback(
        (range: RangeShortcutEnum) =>
          setValue && buildHandleRangeClick(setValue)(range),
        [setValue]
      );

      return (
        <>
          <Box
            {...other}
            sx={{
              backgroundColor: theme.palette.customColors.magnolia,
            }}
          >
            {paperContent}
          </Box>
          {showTerm && (
            <Stack
              direction="row"
              flexWrap="wrap"
              sx={{ pt: 4, px: 4, width: theme.spacing(156.5) }}
            >
              {rangeShortcuts.map(({ range, label }, inx) => (
                <Stack
                  direction="row"
                  sx={{
                    cursor: 'pointer',
                    flex: '1 1 25%',
                    mb: 4,
                  }}
                  alignItems="center"
                  key={inx?.toString()}
                  onClick={() => handleRangeClick(range as RangeShortcutEnum)}
                >
                  <Radio
                    color="success"
                    checked={range === currentRange}
                    sx={{
                      p: theme.spacing(0, 2, 0, 0),
                      color: theme.palette.text.primary,
                    }}
                  />
                  <Typography>{label}</Typography>
                </Stack>
              ))}
            </Stack>
          )}
          {children}
        </>
      );
    },
    [paperContent, currentRange]
  );

  const onDateChange = useCallback((newValue: DateRange<any>) => {
    if (!newValue?.[0] || !newValue[1]) {
      setValue(newValue);
      setCurrentRange(RangeShortcutEnum.Other);
      return;
    }
    setValue(newValue);
  }, []);

  const _adapterLocaleByLang = useMemo(() => {
    return adapterLocaleByLang(settings?.language);
  }, [settings?.language]);

  const _dayOfWeekFormatter = useCallback(
    (day: string) => dayOfWeekFormatter(day, settings?.language),
    [settings]
  );

  const closeModal = useCallback(() => {
    if (openProps === undefined) {
      setOpen(false);
    }
  }, [openProps]);

  const actionBar = useCallback(
    (actionProps: any) =>
      CustomActionBar({
        ...actionProps,
        onClear: () => {
          props?.onClear?.();
          closeModal();
          setValue([null, null]);
          setCurrentRange(RangeShortcutEnum.AllTime);
        },
        onCancel: () => {
          props?.onCancel?.();
          closeModal();
          setCurrentRange(rangeProps);
          actionProps?.onCancel();
        },
        onAccept: () => {
          props?.onAccept?.();
          closeModal();
          props?.onChange?.(value, currentRange);
          actionProps?.onAccept();
        },
      }),
    [value, currentRange]
  );

  const renderInput = useCallback(
    (startProps: MuiTextFieldProps, endProps: MuiTextFieldProps) => {
      let _value = '';
      if (currentRange === RangeShortcutEnum.AllTime) {
        _value = t('all_time');
      } else if (startProps?.inputProps?.value || endProps?.inputProps?.value) {
        _value = `${formatDate(
          startProps?.inputProps?.value,
          DATE_FORMAT_DD_MMM_YYYY_SLASH
        )} ~ ${
          endProps?.inputProps?.value
            ? formatDate(
                endProps?.inputProps?.value,
                DATE_FORMAT_DD_MMM_YYYY_SLASH
              )
            : ''
        }`;
      }

      return (
        <TextField
          {...startProps}
          label=""
          inputProps={{
            ...startProps.inputProps,
            value: _value,
            placeholder: t('select_term'),
            onChange: () => undefined,
            style: {
              height: theme.spacing(3.25),
            },
          }}
          error={false}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <ArrowDropDownIcon color="secondary" />
              </InputAdornment>
            ),
          }}
        />
      );
    },
    []
  );

  const close = useCallback(() => {
    closeModal();
    props?.onClose?.();
    setTimeout(() => {
      setCurrentRange(rangeProps ?? RangeShortcutEnum.AllTime);
    }, 500);
  }, [rangeProps]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={_adapterLocaleByLang}
    >
      <DateRangePickerMuiStyled
        {...props}
        DialogProps={{
          fullWidth: true,
        }}
        onClose={close}
        value={value}
        open={open}
        onChange={onDateChange}
        components={{
          PaperContent: showRangeShortcutsPanel
            ? staticRangeShortcutsPanel
            : undefined,
          ActionBar: actionBar,
        }}
        closeOnSelect={false}
        dayOfWeekFormatter={_dayOfWeekFormatter}
        renderInput={props?.renderInput || renderInput}
      />
    </LocalizationProvider>
  );
};

export const DateRangePicker = memo(DateRangePickerComponent);
