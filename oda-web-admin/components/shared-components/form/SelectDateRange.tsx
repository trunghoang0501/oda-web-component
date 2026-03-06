import { equals } from 'rambda';
import React, { Dispatch, memo, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/system';
import { InputAdornment, TextField } from '@mui/material';
import { DateRangePicker } from '@/components/shared-components/date-range-picker/DateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';

import {
  DATE_FORMAT_DD_MMM_YYYY_SLASH,
  formatDate,
  LanguageEnum,
} from '@/utils';
import { MuiTextFieldProps } from '@mui/x-date-pickers/internals';
import { useSettings } from '@/hooks/useSettings';
import { CalendarTodayOutlined } from '@mui/icons-material';
import { FilterDateType } from '@/types';
import { RangeShortcutEnum } from '@/constants';

type ISelectDateRangeComponentProps = {
  dates?: FilterDateType;
  setDates?: Dispatch<SetStateAction<FilterDateType>>;
  showRangeShortcutsPanel?: boolean;
};

const SelectDateRangeComponent = ({
  dates,
  setDates,
  showRangeShortcutsPanel = false,
}: ISelectDateRangeComponentProps) => {
  const [t] = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = React.useState<boolean>(false);

  const {
    settings: { language },
  } = useSettings();

  const onChange = useCallback(
    (newValue: DateRange<any>, range: RangeShortcutEnum) => {
      setDates?.({
        from: newValue?.[0]?.$d?.toString() ?? newValue[0] ?? null,
        to: newValue?.[1]?.$d?.toString() ?? newValue[1] ?? null,
        timeType: range,
      });
    },
    [dates]
  );

  const onClear = useCallback(() => {
    setDates?.({ timeType: RangeShortcutEnum.AllTime });
  }, []);

  const onCancel = useCallback(() => {
    closeModalSelectDates();
  }, []);

  const onAccept = useCallback(() => {
    closeModalSelectDates();
  }, []);

  const onClose = useCallback(() => {
    closeModalSelectDates();
  }, []);

  const openModalSelectDates = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModalSelectDates = useCallback(() => {
    setOpen(false);
  }, []);

  const renderInput = useCallback(
    (startProps: MuiTextFieldProps, endProps: MuiTextFieldProps) => {
      let _value = '';
      if (dates?.timeType === RangeShortcutEnum.AllTime) {
        _value = t('all_time');
      } else if (startProps?.inputProps?.value || endProps?.inputProps?.value) {
        _value = `${
          language !== LanguageEnum.vi_VN
            ? formatDate(
                new Date(startProps?.inputProps?.value),
                DATE_FORMAT_DD_MMM_YYYY_SLASH
              )
            : startProps?.inputProps?.value
        } ${t('to').toLocaleLowerCase()} ${
          language !== LanguageEnum.vi_VN
            ? (endProps?.inputProps?.value &&
                formatDate(
                  new Date(endProps?.inputProps?.value),
                  DATE_FORMAT_DD_MMM_YYYY_SLASH
                )) ||
              ''
            : endProps?.inputProps?.value
        }`;
      }

      return (
        <TextField
          {...startProps}
          label=""
          onFocus={openModalSelectDates}
          sx={{
            '@media (min-width:1900px)': { minWidth: theme.spacing(64) },
          }}
          inputProps={{
            ...startProps.inputProps,
            value: _value,
            placeholder: t('from_date_to_date'),
            onChange: () => undefined,
            style: {
              height: theme.spacing(1.75),
              cursor: 'pointer',
            },
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          InputProps={{
            endAdornment: (
              <InputAdornment
                onClick={openModalSelectDates}
                position="end"
                sx={{ cursor: 'pointer' }}
              >
                <CalendarTodayOutlined
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: theme.spacing(5.5),
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      );
    },
    [language, dates]
  );

  return (
    <DateRangePicker
      value={[dates?.from, dates?.to]}
      range={dates?.timeType}
      onChange={onChange}
      renderInput={renderInput}
      onClear={onClear}
      onCancel={onCancel}
      onAccept={onAccept}
      onClose={onClose}
      open={open}
      showRangeShortcutsPanel={showRangeShortcutsPanel}
    />
  );
};

export const SelectDateRange = memo(SelectDateRangeComponent, equals);
