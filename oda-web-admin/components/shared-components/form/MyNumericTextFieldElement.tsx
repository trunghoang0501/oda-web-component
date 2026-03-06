/* eslint-disable react/jsx-no-duplicate-props */
import { TextField, TextFieldProps } from '@mui/material';
import { useController } from 'react-hook-form-mui';
import NumericFormatCustomInput, {
  INumericFormatCustomInputProps,
} from '@/components/shared-components/form/NumericFormatCustomInput';
import debounce from 'debounce';
import { ChangeEvent } from 'react';

export interface IMyNumericTextFieldElementProps {
  name: string;
  textFieldProps?: Omit<
    TextFieldProps,
    'onChange' | 'value' | 'inputProps' | 'error'
  >;
  numericFormatCustomInputProps?: Omit<
    INumericFormatCustomInputProps,
    'onChange' | 'name'
  >;
}

const TEXT_FIELD_ON_CHANGE_DEBOUNCE_TIME = 50;

/**
 * You can use this component the same way with react-hook-form-mui
 */
const MyNumericTextFieldElement = (props: IMyNumericTextFieldElementProps) => {
  const { name, textFieldProps, numericFormatCustomInputProps } = props;
  const { field, fieldState } = useController({
    name,
  });

  const onChange = debounce(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      field.onChange(event);
    },
    TEXT_FIELD_ON_CHANGE_DEBOUNCE_TIME
  );

  return (
    <TextField
      helperText={fieldState.error?.message}
      {...textFieldProps}
      inputMode="numeric"
      name={name}
      inputRef={field.ref}
      onChange={onChange}
      onBlur={field.onBlur}
      value={field.value}
      error={!!fieldState.error}
      inputProps={{
        ...(numericFormatCustomInputProps as any),
      }}
      InputProps={{
        ...textFieldProps?.InputProps,
        inputComponent: NumericFormatCustomInput as any,
      }}
    />
  );
};

export default MyNumericTextFieldElement;
