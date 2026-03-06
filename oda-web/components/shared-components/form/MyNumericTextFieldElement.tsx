/* eslint-disable react/jsx-no-duplicate-props */
import { TextField, TextFieldProps } from '@mui/material';
import { useController } from 'react-hook-form-mui';
import NumericFormatCustomInput from '@/components/shared-components/form/NumericFormatCustomInput';

export interface IMyNumericTextFieldElementProps {
  name: string;
  textFieldProps?: Omit<
    TextFieldProps,
    'onChange' | 'value' | 'inputProps' | 'error'
  >;
}

/**
 * You can use this component the same way with react-hook-form-mui
 */
const MyNumericTextFieldElement = (props: IMyNumericTextFieldElementProps) => {
  const { name, textFieldProps } = props;
  const { field, fieldState } = useController({
    name,
  });

  return (
    <TextField
      helperText={fieldState.error?.message}
      {...textFieldProps}
      inputMode="numeric"
      name={name}
      inputRef={field.ref}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      error={!!fieldState.error}
      InputProps={{
        ...textFieldProps?.InputProps,
        inputComponent: NumericFormatCustomInput as any,
      }}
    />
  );
};

export default MyNumericTextFieldElement;
