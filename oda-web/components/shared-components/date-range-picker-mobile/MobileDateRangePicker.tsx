import { CalendarTodayOutlined } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro';
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils';
import { mediaMobileMax } from '@/utils/constants';

export default function MobileDateRangePicker({
  fromDate,
  toDate,
  onConfirm,
  showDateIcon = false,
  label,
  onClear,
}: {
  fromDate?: string;
  toDate?: string;
  onConfirm: (dates: DateRange<any>) => void;
  onClear: () => void;
  showDateIcon?: boolean;
  label?: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [currentValue, setCurrentValue] = useState<DateRange<any>>([
    dayjs(fromDate).toDate(),
    dayjs(toDate).toDate(),
  ]);
  const [valueTmpDateRangeEnd, setTmpValueDateRangeEnd] = useState<
    DateRange<any>
  >([dayjs(fromDate).toDate(), dayjs(toDate).toDate()]);
  const handleClick = () => {
    setCanSubmit(false);
    setShowDatePicker(!showDatePicker);
  };
  const handleConfirmDate = () => {
    handleClick();
    setCurrentValue(valueTmpDateRangeEnd);
    onConfirm(valueTmpDateRangeEnd);
  };
  const handleClickCancel = () => {
    handleClick();
    setTmpValueDateRangeEnd(currentValue);
  };
  const hasValue = useMemo(() => {
    return !(
      formatDate(currentValue[0]).includes('Invalid') ||
      formatDate(currentValue[1]).includes('Invalid')
    );
  }, [currentValue]);
  const handleReset = () => {
    setTmpValueDateRangeEnd([null, null]);
    setCurrentValue(valueTmpDateRangeEnd);
    setCanSubmit(true);
    onClear();
  };
  const textLabel = (() => {
    if (label) return label;
    return t('select_time_range');
  })();
  return (
    <Box>
      <Box>
        <Box
          onClick={handleClick}
          sx={{
            textAlign: 'left',
            width: '100%',
            border: `1px solid ${theme.palette.text.secondary}`,
            borderRadius: theme.spacing(1.5),
            p: `${theme.spacing(1)} ${theme.spacing(2)}`,
            color: hasValue
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box>
            {hasValue
              ? `${formatDate(currentValue[0])} ~ ${formatDate(
                  currentValue[1]
                )}`
              : textLabel}
          </Box>
          <Box ml="auto" sx={{ mt: showDateIcon ? 1 : 0 }}>
            {showDateIcon ? <CalendarTodayOutlined /> : <ArrowDropDownIcon />}
          </Box>
        </Box>
      </Box>
      {showDatePicker && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1111,
            '& .MuiDialogActions-root': {
              display: 'none',
            },
            '& .MuiPickersToolbar-root > .MuiTypography-overline': {
              display: 'none',
            },
            [mediaMobileMax]: {
              '& button': {
                mb: '0 !important',
              },
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateRangePicker
                onAccept={() => {
                  handleClick();
                }}
                maxDate={dayjs().toDate()}
                onChange={(value) => {
                  setCanSubmit(value[0] != null && value[1] != null);
                  setTmpValueDateRangeEnd(value);
                }}
                value={valueTmpDateRangeEnd}
                renderInput={() => <></>}
              />
            </LocalizationProvider>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 4,
                '& button': {
                  fontSize: theme.spacing(3.5),
                },
              }}
            >
              <Button onClick={handleReset}>{t('reset')}</Button>
              <Button
                sx={{
                  ml: 'auto',
                }}
                onClick={handleClickCancel}
                variant="text"
                color="secondary"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handleConfirmDate}
                variant="text"
                color="primary"
                disabled={!canSubmit}
              >
                {t('ok')}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
