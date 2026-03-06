import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainTitle from '@/components/common/Title.styled';
import { MyDateTimePicker } from '@/components/shared-components/form/MyDateTimePicker';
import useLocale from '@/hooks/useLocale';
import { DatePickerInputValueType } from '@/types';
import {
  DATE_FORMAT_YYYY_MM_DD_HH_MM,
  DATE_FORMAT_YYYY_MM_DD_HH_MM_SS,
  compareDate,
  formatDate,
  getTimeRoundedWithMinuteStep,
} from '@/utils';
import { MEDIA_QUERY_MOBILE, MINUTE_STEP_DEFAULT } from '@/utils/constants';
import { getDefaultCompletedDateBasedOnDeliveryDate } from '@/utils/order';
import { IChangeOrderToCompleteStatusModalProps } from './types';

export const ChangeOrderToCompleteStatusModal = (
  props: IChangeOrderToCompleteStatusModalProps
) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    onCancel,
    onConfirm,
    dateValue,
    confirmButtonColor = 'success',
    deliveredDate,
    ...restProps
  } = props;
  const locale = useLocale();
  const isMobile = useMediaQuery(MEDIA_QUERY_MOBILE);
  const [value, setValue] = useState<DatePickerInputValueType>(
    getTimeRoundedWithMinuteStep(dateValue)
  );

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (deliveredDate) {
      const compare = compareDate(
        deliveredDate,
        dayjs().format(DATE_FORMAT_YYYY_MM_DD_HH_MM_SS)
      );
      if (compare > 0) {
        setValue(getDefaultCompletedDateBasedOnDeliveryDate(deliveredDate));
      } else {
        setValue(getDefaultCompletedDateBasedOnDeliveryDate(dayjs()));
      }
    }
  }, [deliveredDate]);

  const minDate = useMemo(() => {
    if (deliveredDate) {
      return dayjs(deliveredDate);
    }
    return undefined;
  }, [deliveredDate]);

  const handleCancel = () => {
    onCancel();
  };

  const handleChange = (newValue: DatePickerInputValueType) => {
    if (dayjs(newValue).isSameOrAfter(minDate)) {
      setHasError(false);
    } else {
      setHasError(true);
    }
    setValue(newValue);
  };

  const handleConfirm = () => {
    onConfirm(value);
  };

  const datePicker = (() => {
    if (isMobile) {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
          <DateTimePicker
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    value: formatDate(
                      dayjs(value),
                      DATE_FORMAT_YYYY_MM_DD_HH_MM
                    ),
                  }}
                  InputProps={{
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
                  }}
                  sx={{
                    width: '100%',
                  }}
                />
              );
            }}
            label={t(
              'change_order_to_complete_status_modal.completed_date_and_time'
            )}
            value={value}
            disabled={!deliveredDate}
            onChange={handleChange}
            minDateTime={minDate}
            maxDateTime={dayjs().endOf('day')}
            minutesStep={MINUTE_STEP_DEFAULT}
          />
        </LocalizationProvider>
      );
    }

    return (
      <MyDateTimePicker
        value={value}
        minuteStep={MINUTE_STEP_DEFAULT}
        datePickerProps={{
          minDate,
          maxDate: dayjs().endOf('day'),
          disabled: !deliveredDate,
          label: t(
            'change_order_to_complete_status_modal.completed_date_and_time'
          ),
        }}
        onChange={handleChange}
      />
    );
  })();

  return (
    <Dialog {...restProps}>
      <MainTitle
        sx={{
          p: 4,
          textAlign: 'center',
          fontSize: theme.spacing(7),
        }}
      >
        {t('notification')}
      </MainTitle>

      <DialogContent>
        <Typography fontWeight="600">
          {t(
            'change_order_to_complete_status_modal.please_select_completed_date_and_time'
          )}
        </Typography>

        <Box mt={6} width="100%">
          {datePicker}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          {t('cancel')}
        </Button>

        <Button
          variant="contained"
          color={confirmButtonColor}
          onClick={handleConfirm}
          disabled={hasError}
        >
          {t('ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
