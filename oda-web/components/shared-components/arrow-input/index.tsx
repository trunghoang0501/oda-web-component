import { Box, TextField, TextFieldProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IMask from 'imask';
import { FocusEvent, useCallback } from 'react';
import ArrowDownIcon from '@/components/icon/arrow-down-icon';
import { formatSeparateCommasTextToIntNumber } from '@/utils';
import {
  NUMBER_INVENTORY_MASK_ALLOW_NEGATIVE,
  NUMBER_INVENTORY_MASK_POSITIVE_ONLY,
  NUMBER_MASK_ALLOW_DECIMAL,
  NUMBER_MASK_ALLOW_DECIMAL_AND_POSITIVE,
  mediaMobileMax,
} from '@/utils/constants';
import TextMask from '../TextMask';

interface IArrowInputProps
  extends Omit<TextFieldProps, 'value' | 'onChange' | 'disabled'> {
  value: string;
  onChange: (value: any) => void;
  placeHolderColor?: string;
  disabled?: boolean;
  isAllowNegative?: boolean;
  isAllowNull?: boolean;
  showArrowIcon?: boolean;
  error?: boolean;
  isAllowDecimal?: boolean;
}

export const ArrowInput = (props: IArrowInputProps) => {
  const {
    onChange,
    value,
    placeHolderColor,
    disabled = false,
    isAllowDecimal = false,
    isAllowNegative = true,
    isAllowNull = false,
    showArrowIcon = true,
    error = false,
    onBlur,
    variant = 'standard',
    ...arrowInputProps
  } = props;
  const theme = useTheme();

  const maskOption = (() => {
    if (isAllowDecimal) {
      if (!isAllowNegative) {
        return NUMBER_MASK_ALLOW_DECIMAL_AND_POSITIVE;
      }
      return NUMBER_MASK_ALLOW_DECIMAL;
    }
    if (!isAllowDecimal && isAllowNegative) {
      return NUMBER_INVENTORY_MASK_ALLOW_NEGATIVE;
    }
    return NUMBER_INVENTORY_MASK_POSITIVE_ONLY;
  })();

  const changeValue = useCallback(
    (number: number) => {
      const newSeparateCommasText = IMask.createMask(maskOption)?.resolve(
        number?.toString()
      );
      return onChange?.(newSeparateCommasText);
    },
    [isAllowNegative, onChange]
  );

  const onClickUp = () => {
    const number = formatSeparateCommasTextToIntNumber(value) ?? 0;
    const newAddedNumber = number + 1;
    changeValue(newAddedNumber);
  };

  const onClickDown = () => {
    const number = formatSeparateCommasTextToIntNumber(value) ?? 0;
    const newSubtractNumber = number - 1;
    changeValue(newSubtractNumber);
  };

  const containerStyle = {
    flexDirection: 'column',
    position: 'relative',
    height: theme.spacing(5),
    width: theme.spacing(2.5),
    [mediaMobileMax]: {
      width: '100%',
    },
    '& .MuiSvgIcon-root': {
      width: 'auto',
      height: 'auto',
      position: 'absolute',
      right: 0,
      top: theme.spacing(0.625),
      cursor: disabled ? null : 'pointer',
      '&:focus': disabled
        ? null
        : {
            fill: `${theme.palette.text.primary} !important`,
            '& path': {
              fill: `${theme.palette.text.primary} !important`,
            },
          },
      '&:hover': disabled
        ? null
        : {
            fill: `${theme.palette.text.primary} !important`,
            '& path': {
              fill: `${theme.palette.text.primary} !important`,
            },
          },

      '&:last-child': {
        top: theme.spacing(3.125),
        transform: 'rotate(180deg)',
      },
    },
  };
  const renderArrow = () => {
    return (
      <Box sx={containerStyle}>
        <ArrowDownIcon
          color={disabled ? 'secondary' : undefined}
          onClick={disabled ? () => null : onClickUp}
        />
        <ArrowDownIcon
          color={disabled ? 'secondary' : undefined}
          onClick={
            disabled || (!isAllowNegative && value === '0')
              ? () => null
              : onClickDown
          }
        />
      </Box>
    );
  };

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
      //  set value to zero when onBlur if field is empty
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
      {...arrowInputProps}
      variant={variant}
      inputMode="numeric"
      error={error}
      sx={{
        '& input': {
          textAlign: 'right',
          color: theme.palette.text.primary,
          '&::placeholder': {
            textOverflow: 'ellipsis !important',
            color: `${placeHolderColor ?? theme.palette.text.primary}`,
            opacity: '100%',
          },
          [mediaMobileMax]: {
            textAlign: 'left',
          },
        },
        ...arrowInputProps.sx,
        [mediaMobileMax]: {
          width: '100%',
        },
      }}
      InputProps={{
        inputComponent: TextMask as any,
        endAdornment: showArrowIcon ? (
          <Box sx={{ mr: 2, ml: 4 }}>{renderArrow()}</Box>
        ) : null,
        ...arrowInputProps.InputProps,
      }}
      inputProps={{
        ...maskOption,
        ...arrowInputProps.inputProps,
        placeholder: isAllowNull ? '-' : '',
      }}
      onBlur={handleBlur}
      disabled={disabled}
      onChange={onChangeValue}
      value={value}
    />
  );
};

export default ArrowInput;
