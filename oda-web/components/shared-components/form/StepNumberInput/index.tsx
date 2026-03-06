import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import {
  Box,
  BoxProps,
  IconButton,
  TextField,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import deepmerge from 'deepmerge';
import { useEffect, useState } from 'react';
import { NUMBER_DECIMAL_SCALE_MAX } from '@/constants';
import NumericFormatCustomInput, {
  INumericFormatCustomInputProps,
} from '../NumericFormatCustomInput';

export interface IStepNumberInputProps {
  value: number;
  valueStep?: number;
  onChange?: (value: number) => void;
  onBlur?: (value: number) => void;
  allowDecimal?: boolean;
  minValue?: number;
  maxValue?: number;
  error?: boolean;
  highlight?: boolean;
  helperMessage?: string;
  disabled?: boolean;
  preventEnterSubmit?: boolean;
  sx?: BoxProps['sx'];
}

const DEFAULT_MAX_VALUE = 9999;

export const StepNumberInput = (props: IStepNumberInputProps) => {
  const {
    value,
    onChange,
    onBlur,
    allowDecimal = false,
    valueStep = 1,
    minValue = 0,
    maxValue = DEFAULT_MAX_VALUE,
    error = false,
    highlight = false,
    helperMessage = '',
    disabled = false,
    preventEnterSubmit = false,
    sx = {},
  } = props;
  const theme = useTheme();
  const [withNotify, setWithNotify] = useState(false);
  const [inputValue, setInputValue] = useState<number>(value);

  const isDisableMinusBtn = value <= minValue;
  const isDisablePlusBtn = value >= maxValue;

  const valueStandardization = (newValue: number) => {
    if (newValue < minValue) return minValue;
    if (newValue > maxValue) return maxValue;
    return newValue;
  };

  // Helper function to fix floating point precision issues
  const fixFloatPrecision = (
    num: number,
    decimals: number = NUMBER_DECIMAL_SCALE_MAX
  ): number => {
    const factor = 10 ** decimals;
    return Math.round(num * factor) / factor;
  };

  const handleClickMinus = () => {
    // Fix floating point precision by using proper decimal arithmetic
    const result = fixFloatPrecision(inputValue - valueStep);
    let newValue = result;
    if (newValue < minValue) {
      newValue = minValue;
    }
    setWithNotify(true);
    setInputValue(valueStandardization(newValue));
    // onChange?.(valueStandardization(newValue));
  };

  const handleClickPlus = () => {
    // Fix floating point precision by using proper decimal arithmetic
    const result = fixFloatPrecision(inputValue + valueStep);
    let newValue = result;
    if (newValue > maxValue) {
      newValue = maxValue;
    }
    setWithNotify(true);
    setInputValue(valueStandardization(newValue));
  };

  const handleOnInputChange: TextFieldProps['onChange'] = (e) => {
    setWithNotify(true);
    setInputValue(Number(e.target.value));
  };

  const handleKeyDown: TextFieldProps['onKeyDown'] = (e) => {
    if (preventEnterSubmit && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      // Blur the input field to complete the input step
      const target = e.target as HTMLInputElement;
      if (target) {
        target.blur();
      }
    }
  };

  useEffect(() => {
    if (withNotify) {
      onChange?.(inputValue);
    }
  }, [inputValue, withNotify]);
  useEffect(() => {
    if (value !== inputValue) {
      setWithNotify(false);
      setInputValue(value);
    }
  }, [value]);
  const hightLightColor = theme.palette.primary.main;

  const sxMerged = deepmerge.all<BoxProps['sx']>([
    {
      textAlign: 'left',
      '.step-number-input__inner': {
        display: 'inline-flex',
        alignItems: 'center',
        columnGap: 1,
        height: theme.spacing(10),
      },
      '.step-number-input__input-col': {
        width: theme.spacing(25),
      },
      '.MuiInputBase-input': {
        textAlign: 'center',
        fontWeight: 600,
        color: (() => {
          if (error) {
            return;
          }

          if (value <= 0) {
            return undefined;
          }

          return highlight && !disabled ? hightLightColor : undefined;
        })(),
      },
      '.MuiOutlinedInput-root': {
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: (() => {
            if (error) {
              return;
            }

            return highlight && !disabled ? hightLightColor : undefined;
          })(),
        },
      },
    },
    sx,
  ]);

  return (
    <Box className="step-number-input" sx={sxMerged}>
      <Box className="step-number-input__inner">
        <Box className="step-number-input__minus-col">
          <IconButton
            disabled={isDisableMinusBtn || disabled}
            onClick={handleClickMinus}
          >
            <RemoveCircleOutlineOutlinedIcon />
          </IconButton>
        </Box>

        <Box className="step-number-input__input-col">
          <TextField
            className="number-text-field"
            value={inputValue}
            disabled={disabled}
            onChange={handleOnInputChange}
            onKeyDown={handleKeyDown}
            fullWidth
            size="small"
            error={error}
            inputProps={
              {
                allowNegative: true,
                isAllowed: (values) => {
                  if (values.value === '-') return true;
                  const newValue = Number(values.value);
                  return newValue >= minValue && newValue <= maxValue;
                },
                decimalScale: allowDecimal ? NUMBER_DECIMAL_SCALE_MAX : 0,
              } as INumericFormatCustomInputProps as any
            }
            InputProps={{
              inputComponent: NumericFormatCustomInput as any,
            }}
          />
        </Box>

        <Box className="step-number-input__plus-col">
          <IconButton
            disabled={isDisablePlusBtn || disabled}
            onClick={handleClickPlus}
          >
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
        </Box>
      </Box>

      {helperMessage && (
        <Box
          className="step-number-input__helper-message"
          sx={{
            mt: 1,
            fontSize: theme.spacing(3),
            color: error ? theme.palette.error.main : undefined,
          }}
        >
          {helperMessage}
        </Box>
      )}
    </Box>
  );
};
