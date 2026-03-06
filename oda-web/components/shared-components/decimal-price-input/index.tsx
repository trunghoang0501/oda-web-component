import { TextField, TextFieldProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IMask from 'imask';
import { FocusEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NUMBER_PRICE_MASK, mediaMobileMax } from '@/utils/constants';
import TextMask from '../TextMask';

interface IDecimalPriceInputProps
  extends Omit<TextFieldProps, 'value' | 'onChange' | 'disabled'> {
  value: string;
  onChange: (value: any) => void;
  placeHolderColor?: string;
  disabled?: boolean;
  isAllowNull?: boolean;
  error?: boolean;
  name?: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  variant?: 'standard' | 'outlined';
  align?: 'left' | 'right';
}

export const DecimalPriceInput = (props: IDecimalPriceInputProps) => {
  const {
    onChange,
    value,
    placeHolderColor,
    disabled = false,
    isAllowNull = false,
    error = false,
    onBlur,
    variant = 'outlined',
    name,
    label,
    required,
    helperText,
    align = 'left',
    ...decimalPriceInputProps
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  // Use the mask that allows decimals and positive numbers only
  const maskOption = NUMBER_PRICE_MASK;

  const changeValue = useCallback(
    (number: number) => {
      const newSeparateCommasText = IMask.createMask(maskOption)?.resolve(
        number?.toString()
      );
      return onChange?.(newSeparateCommasText);
    },
    [onChange, maskOption]
  );

  const onChangeValue = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
      onChange('0');
    } else {
      onChange(inputValue);
    }
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    if (value?.length === 0 || !value) {
      // set value to zero when onBlur if field is empty
      if (!isAllowNull) {
        onChange('0');
      } else {
        onChange(null);
      }
    }
    onBlur?.(e);
  };

  return (
    <TextField
      {...decimalPriceInputProps}
      variant={variant}
      inputMode="numeric"
      error={error}
      sx={{
        '& input': {
          color: theme.palette.text.primary,
          '&::placeholder': {
            textOverflow: 'ellipsis !important',
            color: `${placeHolderColor ?? theme.palette.text.primary}`,
            opacity: '100%',
          },
          textAlign: align,
        },
        ...decimalPriceInputProps.sx,
        [mediaMobileMax]: {
          width: '100%',
        },
        '& .MuiFormHelperText-root': {
          color: theme.palette.error.main,
        },
        '& fieldset.MuiOutlinedInput-notchedOutline': {
          borderColor: error
            ? `${theme.palette.error.main}!important`
            : undefined,
        },
        '& label': {
          color: error ? `${theme.palette.error.main}!important` : undefined,
        },
      }}
      InputProps={{
        inputComponent: TextMask as any,
        ...decimalPriceInputProps.InputProps,
      }}
      inputProps={{
        ...maskOption,
        ...decimalPriceInputProps.inputProps,
        placeholder: isAllowNull ? '-' : '',
      }}
      onBlur={handleBlur}
      disabled={disabled}
      onChange={onChangeValue}
      value={value ?? ''}
      name={name}
      label={label}
      required={required}
      helperText={helperText}
      InputLabelProps={{ shrink: true }}
    />
  );
};

export default DecimalPriceInput;
