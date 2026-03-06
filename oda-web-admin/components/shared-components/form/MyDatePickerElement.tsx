import { CalendarTodayOutlined } from '@mui/icons-material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import deepmerge from 'deepmerge';
import { useRef } from 'react';
import { useController } from 'react-hook-form-mui';
import { DATE_FORMAT_DD_MMM_YYYY_SLASH, formatDate } from '@/utils';

export interface IMyDatePickerElementProps {
  name: string;
  datePickerProps?: Omit<
    DatePickerProps<Dayjs, Dayjs>,
    'value' | 'onChange' | 'renderInput'
  >;
  textFieldProps?: TextFieldProps;
  onChange?: (
    value: Dayjs | null,
    keyboardInputValue?: string | undefined
  ) => void;
}

/**
 * You can use this component the same way with react-hook-form-mui
 */
const MyDatePickerElement = (props: IMyDatePickerElementProps) => {
  const { name, datePickerProps, textFieldProps } = props;
  const { field, fieldState } = useController({
    name,
    defaultValue: null as any,
  });
  const divWrapperRef = useRef<HTMLDivElement | null>(null);
  const inputFormat =
    datePickerProps?.inputFormat ?? DATE_FORMAT_DD_MMM_YYYY_SLASH;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        inputFormat={inputFormat}
        components={{
          OpenPickerIcon: CalendarTodayOutlined,
          ...datePickerProps?.components,
        }}
        {...field}
        {...datePickerProps}
        ref={(r) => {
          field.ref(r?.querySelector('input'));
          divWrapperRef.current = r;
        }}
        onClose={(...args) => {
          field.onBlur();
          if (datePickerProps?.onClose) {
            datePickerProps.onClose(...args);
          }
        }}
        onChange={(v, keyboardInputValue) => {
          field.onChange(v, keyboardInputValue);
        }}
        renderInput={({ error: _, ...params }) => {
          const displayValue = field.value?.$d
            ? formatDate(field.value?.$d.toString(), inputFormat)
            : '';

          return (
            <TextField
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
                defaultValue: displayValue,
                readOnly: true,
              }}
              error={!!fieldState.error}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default MyDatePickerElement;
