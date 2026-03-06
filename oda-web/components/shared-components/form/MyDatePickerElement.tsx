import { CalendarTodayOutlined } from '@mui/icons-material';
import { IconButton, InputAdornment, useTheme } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import deepmerge from 'deepmerge';
import { useRef, useState } from 'react';
import { useController, useWatch } from 'react-hook-form-mui';
import useLocale from '@/hooks/useLocale';
import {
  DATE_FORMAT_DD_MMM_YYYY_SLASH,
  dayOfWeekFormatter,
  formatDate,
} from '@/utils';

export interface IMyDatePickerElementProps {
  name: string;
  onChange?: (
    value: Dayjs | null,
    keyboardInputValue?: string | undefined
  ) => void;
  datePickerProps?: Omit<
    DatePickerProps<Dayjs, Dayjs>,
    'value' | 'onChange' | 'renderInput'
  >;
  textFieldProps?: TextFieldProps;
  required?: boolean;
}

/**
 * You can use this component the same way with react-hook-form-mui
 */
const MyDatePickerElement = (props: IMyDatePickerElementProps) => {
  const theme = useTheme();
  const { name, onChange, datePickerProps, textFieldProps, required } = props;
  const fieldValue = useWatch({
    name,
  });
  const { field, fieldState } = useController({
    name,
    defaultValue: null as any,
  });
  const divWrapperRef = useRef<HTMLDivElement | null>(null);
  const inputFormat =
    datePickerProps?.inputFormat ?? DATE_FORMAT_DD_MMM_YYYY_SLASH;
  const locale = useLocale();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const handleOpen = () => {
    if (datePickerProps?.disabled) {
      return;
    }
    setOpenDatePicker(true);
  };
  return (
    <LocalizationProvider adapterLocale={locale} dateAdapter={AdapterDayjs}>
      <DatePicker
        open={openDatePicker}
        inputFormat={inputFormat}
        components={{
          OpenPickerIcon: CalendarTodayOutlined,
          ...datePickerProps?.components,
        }}
        {...field}
        {...datePickerProps}
        PaperProps={deepmerge<DatePickerProps<Dayjs, Dayjs>['PaperProps']>(
          datePickerProps?.PaperProps || {},
          {
            sx: {
              '.MuiPickersCalendarHeader-label': {
                textTransform: 'capitalize',
              },
            },
          }
        )}
        ref={(r) => {
          field.ref(r?.querySelector('input'));
          divWrapperRef.current = r;
        }}
        onClose={(...args) => {
          field.onBlur();
          if (datePickerProps?.onClose) {
            datePickerProps.onClose(...args);
          }
          setOpenDatePicker(false);
        }}
        onChange={(v, keyboardInputValue) => {
          field.onChange(v, keyboardInputValue);
          onChange?.(v, keyboardInputValue);
        }}
        renderInput={({ error: _, ...params }) => {
          const displayValue = fieldValue?.$d
            ? formatDate(fieldValue?.$d.toString(), inputFormat)
            : '';

          return (
            <TextField
              required={required}
              helperText={fieldState.error?.message}
              {...deepmerge.all([params, textFieldProps ?? {}])}
              inputProps={{
                ...deepmerge.all([
                  params.inputProps ?? {},
                  textFieldProps?.inputProps ?? {},
                ]),
                onClick: () => {
                  // Support click input to show popup pick date
                  if (!divWrapperRef.current) return;
                  (
                    divWrapperRef.current?.querySelector(
                      '.MuiIconButton-edgeEnd'
                    ) as HTMLDivElement
                  )?.click();
                },
                value: displayValue,
                readOnly: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={handleOpen}>
                      <CalendarTodayOutlined />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!fieldState.error}
              sx={{
                '& .MuiIconButton-root': {
                  color: theme.palette.text.primary,
                },
              }}
            />
          );
        }}
        dayOfWeekFormatter={(day) => dayOfWeekFormatter(day, locale)}
      />
    </LocalizationProvider>
  );
};

export default MyDatePickerElement;
