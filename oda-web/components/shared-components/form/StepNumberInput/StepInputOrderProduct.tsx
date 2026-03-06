import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
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
import useMobileDetect from '@/hooks/useMobileDetect';
import { mediaMobileMax } from '@/utils/constants';
import NumericFormatCustomInput, {
  INumericFormatCustomInputProps,
} from '../NumericFormatCustomInput';

export interface IStepInputOrderProductProps {
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
  placeholder?: string;
  preventEnterSubmit?: boolean;
  sx?: BoxProps['sx'];
}

const DEFAULT_MAX_VALUE = 9999;

export const StepInputOrderProduct = (props: IStepInputOrderProductProps) => {
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
    placeholder,
    preventEnterSubmit = false,
    sx = {},
  } = props;
  const theme = useTheme();

  const isDisableMinusBtn = value <= minValue;
  const isDisablePlusBtn = value >= maxValue;
  const [withNotify, setWithNotify] = useState(false);
  const [inputValue, setInputValue] = useState<number>(value);
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
    // const result = fixFloatPrecision(inputValue - valueStep);
    // let newValue = result;
    let newValue = inputValue - valueStep;
    if (newValue < minValue) {
      newValue = minValue;
    }
    setWithNotify(true);
    setInputValue(valueStandardization(newValue));
  };

  const handleClickPlus = () => {
    // Fix floating point precision by using proper decimal arithmetic
    // const result = fixFloatPrecision(inputValue + valueStep);
    // let newValue = result;
    let newValue = inputValue + valueStep;
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
        [mediaMobileMax]: {
          borderRadius: theme.spacing(8),
          border: `1px solid ${theme.palette.error.main}`,
          height: theme.spacing(9),
          maxWidth: '110px',
        },
      },
      '.step-number-input__input-col': {
        width: theme.spacing(25),
        [mediaMobileMax]: {
          width: theme.spacing(10),
          '& input, & fieldset, & input:focus, & fieldset:focus,': {
            border: 'none',
            outline: 'none',
          },
        },
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
  const mobile = useMobileDetect();
  return (
    <Box className="step-number-input" sx={sxMerged}>
      <Box className="step-number-input__inner">
        <Box className="step-number-input__minus-col">
          <IconButton
            disabled={isDisableMinusBtn || disabled}
            onClick={handleClickMinus}
            sx={{
              [mediaMobileMax]: {
                width: '36px',
                height: '50px',
              },
            }}
          >
            {mobile.isMobile() ? (
              <RemoveIcon sx={{ color: theme.palette.error.main }} />
            ) : (
              <RemoveCircleOutlineOutlinedIcon />
            )}
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
            placeholder={placeholder}
            inputProps={
              {
                allowNegative: true,
                isAllowed: (values) => {
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
            sx={{
              [mediaMobileMax]: {
                width: '36px',
                height: '50px',
              },
            }}
          >
            {mobile.isMobile() ? (
              <AddIcon sx={{ color: theme.palette.error.main }} />
            ) : (
              <AddCircleOutlineOutlinedIcon />
            )}
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
