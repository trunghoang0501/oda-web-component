import { DatePickerInputValueType, MuiDatePickerProps } from '@/types';
import { CalendarTodayOutlined } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { debounce } from 'debounce';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useController, useWatch } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { DATE_FORMAT_YYYY_MM_DD_HH_MM, hexToRGBA } from 'src/utils';
import { getFirstFieldErrorMessage } from 'src/utils/form';
import { DEFAULT_MINUTE_STEP, TimeModeEnum } from './constants';
import { IMyDateTimePickerElementProps } from './types';
import { getHourList, getMinuteList } from './utils';

/**
 * You can use this component the same way with react-hook-form-mui
 */
export const MyDateTimePickerElement = (
  props: IMyDateTimePickerElementProps
) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    name,
    minuteStep = DEFAULT_MINUTE_STEP,
    datePickerProps = {},
    textFieldProps = {},
  } = props;
  const currentInputValue = useWatch({
    name,
  });
  const { field, fieldState } = useController({
    name,
  });
  const divWrapperRef = useRef<HTMLDivElement | null>(null);
  const inputFormat =
    datePickerProps?.inputFormat ?? DATE_FORMAT_YYYY_MM_DD_HH_MM;
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [hoursValue, setHourValue] = useState(1);
  const [minuteValue, setMinuteValue] = useState(0);
  const [timeMode, setTimeMode] = useState<TimeModeEnum>(TimeModeEnum.Am);
  const [dateValue, setDateValue] =
    useState<DatePickerInputValueType>(currentInputValue);

  const errorMessage = useMemo(() => {
    return getFirstFieldErrorMessage(fieldState.error);
  }, [fieldState.error]);

  const hourList = useMemo(() => {
    return getHourList();
  }, []);

  const minuteList = useMemo(() => {
    return getMinuteList(minuteStep);
  }, [minuteStep]);

  useEffect(() => {
    const currentFieldDate = dayjs(
      currentInputValue?.toString ? currentInputValue.toString() : undefined
    );
    const currentHour = Number(currentFieldDate.format('h'));
    const currentMinute = currentFieldDate.minute();
    const currentTimeMode = currentFieldDate.format('a') as TimeModeEnum;

    setHourValue(currentHour);
    setMinuteValue(currentMinute);
    setTimeMode(currentTimeMode);
    setDateValue(currentInputValue);
  }, [currentInputValue?.toString?.()]);

  const changeHourValue = (value: number) => {
    let newDateValue = dayjs(dateValue);

    let newHourValue = value;
    if (value === 12) {
      if (timeMode === TimeModeEnum.Am) {
        newHourValue = 0;
      } else {
        newHourValue = 12;
      }
    } else if (timeMode === TimeModeEnum.Pm) {
      newHourValue = newHourValue + 12;
    }

    newDateValue = newDateValue.set('hour', newHourValue);
    setHourValue(value);
    setDateValue(newDateValue);
  };

  const changeMinuteValue = (value: number) => {
    let newDateValue = dayjs(dateValue);
    newDateValue = newDateValue.set('minute', value);
    setMinuteValue(value);
    setDateValue(newDateValue);
  };

  const changeTimeMode = (value: TimeModeEnum) => {
    let newDateValue = dayjs(dateValue);

    let newHourValue = hoursValue;
    if (hoursValue === 12) {
      if (value === TimeModeEnum.Am) {
        newHourValue = 0;
      } else {
        newHourValue = 12;
      }
    } else if (value === TimeModeEnum.Pm) {
      newHourValue = newHourValue + 12;
    }

    newDateValue = newDateValue.set('hour', newHourValue);
    setTimeMode(value);
    setDateValue(newDateValue);
  };

  const handleOpen = () => {
    setOpenDatePicker(true);
  };

  /*
    Fixing auto close popover when use touchpad macos change date
  */
  const handleDateChange = useCallback(
    debounce((newValue: DatePickerInputValueType) => {
      setDateValue(newValue);
    }, 50),
    [setDateValue]
  );

  const handleClose = () => {
    field.onBlur();
    setOpenDatePicker(false);
    setDateValue(currentInputValue);
  };

  const handleReset = () => {
    setDateValue(currentInputValue);
  };

  const handleAccept = () => {
    field.onBlur();
    setOpenDatePicker(false);
    field.onChange(dateValue);
  };

  const PaperContentCustom = useCallback(
    (paperContentProps: { children: ReactNode }) => {
      return (
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateAreas: `
                'date time'
                'action action'
              `,
              '& .MuiCalendarPicker-root': {
                gridArea: 'date',
              },
            }}
          >
            {paperContentProps.children}

            <Box
              sx={{
                gridArea: 'time',
                p: theme.spacing(17.5, 6, 4, 6),
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  top: theme.spacing(13.5),
                  width: '1px',
                  background: `${hexToRGBA(theme.palette.common.black, 0.12)}`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  height: 248,
                  overflow: 'hidden',
                  fontSize: theme.spacing(3.5),
                  lineHeight: theme.spacing(5),
                  textAlign: 'center',
                }}
              >
                {/* Select hour */}
                <Box
                  sx={{
                    width: theme.spacing(15),
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {hourList.map((item) => {
                    return (
                      <Box
                        sx={{
                          py: 2,
                          cursor: 'pointer',
                          borderRadius: theme.spacing(1),
                          background:
                            hoursValue === item
                              ? theme.palette.primary.dark
                              : undefined,
                          color:
                            hoursValue === item
                              ? theme.palette.common.white
                              : undefined,
                        }}
                        key={item}
                        onClick={() => {
                          changeHourValue(item);
                        }}
                      >
                        {item.toString().padStart(2, '0')}
                      </Box>
                    );
                  })}
                </Box>

                {/* Select minute */}
                <Box
                  sx={{
                    width: theme.spacing(15),
                    mx: 2,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {minuteList.map((item) => {
                    return (
                      <Box
                        key={item}
                        sx={{
                          py: 2,
                          cursor: 'pointer',
                          borderRadius: theme.spacing(1),
                          background:
                            minuteValue === item
                              ? theme.palette.primary.dark
                              : undefined,
                          color:
                            minuteValue === item
                              ? theme.palette.common.white
                              : undefined,
                        }}
                        onClick={() => {
                          changeMinuteValue(item);
                        }}
                      >
                        {item.toString().padStart(2, '0')}
                      </Box>
                    );
                  })}
                </Box>

                {/* Select time mode AM|PM */}
                <Box
                  sx={{
                    width: theme.spacing(15),
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {Object.values(TimeModeEnum).map((item) => {
                    return (
                      <Box
                        key={item}
                        sx={{
                          py: 2,
                          borderRadius: theme.spacing(1),
                          cursor: 'pointer',
                          background:
                            timeMode === item
                              ? theme.palette.primary.dark
                              : undefined,
                          color:
                            timeMode === item
                              ? theme.palette.common.white
                              : undefined,
                          textTransform: 'uppercase',
                        }}
                        onClick={() => {
                          changeTimeMode(item);
                        }}
                      >
                        {item}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    },
    [dateValue, timeMode, hoursValue, minuteValue]
  );

  const ActionBarCustom = useCallback(() => {
    return (
      <Box
        sx={{
          gridArea: 'action',
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
  }, [handleReset, handleClose, handleAccept]);

  const renderInput = useCallback<MuiDatePickerProps['renderInput']>(
    (params) => {
      const displayValue = params.inputProps?.value || '';

      const arrTextFieldProps: TextFieldProps[] = [
        params,
        {
          helperText: errorMessage,
          InputProps: {},
          inputProps: {
            value: displayValue,
            readOnly: true,
          },
          fullWidth: true,
          error: !!errorMessage,
          sx: {
            '& .MuiIconButton-root': {
              color: theme.palette.text.primary,
            },
          },
          onClick: handleOpen,
        },
        textFieldProps,
      ];

      return (
        <TextField
          {...deepmerge.all(arrTextFieldProps, {
            isMergeableObject: isPlainObject,
          })}
        />
      );
    },
    [dateValue, errorMessage, currentInputValue, textFieldProps]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        ref={divWrapperRef}
        value={dateValue}
        open={openDatePicker}
        inputFormat={inputFormat}
        closeOnSelect={false}
        onClose={handleClose}
        onChange={handleDateChange}
        components={{
          OpenPickerIcon: CalendarTodayOutlined,
          ...datePickerProps?.components,
          PaperContent: PaperContentCustom,
          ActionBar: ActionBarCustom,
        }}
        renderInput={renderInput}
        {...datePickerProps}
      />
    </LocalizationProvider>
  );
};
