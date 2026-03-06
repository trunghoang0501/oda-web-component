import { useSettings } from '@/hooks/useSettings';
import {
  DateRangePickerInputValueType,
  MuiDateRangePickerProps,
} from '@/types';
import {
  DATE_FORMAT_YYYY_MM_DD,
  DateRangeUtils,
  adapterLocaleByLang,
  hexToRGBA,
} from '@/utils';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import {
  Box,
  Grid,
  InputAdornment,
  Radio,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  useTheme,
} from '@mui/material';
import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersSlotsComponent } from '@mui/x-date-pickers/internals/components/wrappers/WrapperProps';
import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/vi';
import { debounce } from 'debounce';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IMyDateRangePickerProps } from './types';
import { useDateRangeShortcut } from './useDateRangeShortcut';

const MyDateRangePicker = (props: IMyDateRangePickerProps) => {
  const {
    value: propValue,
    setValue: propSetValue,
    initialValue = [null, null],
    showShortcutPanel = true,
    paperContent,
    renderInput: propRenderInput,
    textFieldProps = {},
    dateRangePickerProps = {},
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const { settings } = useSettings();
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

  const _adapterLocaleByLang = useMemo(() => {
    return adapterLocaleByLang(settings?.language);
  }, [settings?.language]);

  useEffect(() => {
    setDateValue(propValue);
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

  const handleClose = () => {
    setOpenDatePicker(false);
    setDateValue(propValue);
  };

  const handleAccept = () => {
    setOpenDatePicker(false);
    setHasChangedValue(true);
    propSetValue(dateValue);
  };

  const PaperContentCustom = useCallback(
    (paperContentProps: { children: ReactNode }) => {
      return (
        <Box>
          <Box
            sx={{
              backgroundColor: theme.palette.customColors.magnolia,
            }}
          >
            {paperContent}
          </Box>
          {showShortcutPanel && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 4,
                p: 4,
                mb: 4,
                borderBottom: `1px solid ${hexToRGBA(
                  theme.palette.common.black,
                  0.12
                )}`,
              }}
            >
              {dateRangeShortcutList.map((rangeItem) => {
                return (
                  <Grid key={rangeItem.id} item>
                    <Stack
                      direction="row"
                      sx={{
                        cursor: 'pointer',
                      }}
                      alignItems="center"
                      onClick={() => {
                        rangeItem.onClick();
                      }}
                    >
                      <Radio
                        color="success"
                        checked={rangeItem.isActive}
                        sx={{
                          p: theme.spacing(0, 2, 0, 0),
                          color: theme.palette.text.primary,
                        }}
                      />
                      <Typography>{rangeItem.label}</Typography>
                    </Stack>
                  </Grid>
                );
              })}
            </Box>
          )}

          <Box>{paperContentProps.children}</Box>
        </Box>
      );
    },
    [dateValue, showShortcutPanel, paperContent]
  );

  const ActionBarCustom = useCallback<
    PickersSlotsComponent['ActionBar']
  >(() => {
    return (
      <Box
        sx={{
          display: 'flex',
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
            color: theme.palette.primary.dark,
          }}
          onClick={handleAccept}
        >
          {t('question:ok')}
        </Box>
      </Box>
    );
  }, [dateValue]);

  const renderInput = useCallback<MuiDateRangePickerProps['renderInput']>(
    (startProps, endProps) => {
      const inputValue = (() => {
        if (!hasChangedValue && DateRangeUtils.isAllDateRange(dateValue)) {
          return '';
        }

        if (DateRangeUtils.isAllDateRange(dateValue)) {
          return t('all_time');
        }

        return `${startProps.inputProps?.value} to ${endProps.inputProps?.value}`;
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
                opacity: 1,
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
          },
        },
      },
      inputFormat: DATE_FORMAT_YYYY_MM_DD,
    },
    dateRangePickerProps,
  ];

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={_adapterLocaleByLang}
    >
      <DateRangePicker
        value={dateValue}
        open={openDatePicker}
        onChange={handleDateChange}
        onClose={handleClose}
        closeOnSelect={false}
        components={{
          PaperContent: PaperContentCustom,
          ActionBar: ActionBarCustom,
        }}
        renderInput={propRenderInput || renderInput}
        {...deepmerge.all(combinedDateRangePickerProp, {
          isMergeableObject: isPlainObject,
        })}
      />
    </LocalizationProvider>
  );
};

export type { IMyDateRangePickerProps } from './types';
export default MyDateRangePicker;
