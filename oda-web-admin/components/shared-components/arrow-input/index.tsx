import React, { FocusEvent, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, TextField, TextFieldProps } from '@mui/material';
import ArrowDownIcon from 'src/components/icon/arrow-down-icon';
import { formatSeparateCommasTextToIntNumber } from 'src/utils';
import IMask from 'imask';
import {
  NUMBER_INVENTORY_MASK_POSITIVE_ONLY,
  NUMBER_INVENTORY_MASK_ALLOW_NEGATIVE,
} from 'src/utils/constants';
import TextMask from '../TextMask';
import {
  NUMBER_MASK_ALLOW_DECIMAL,
  NUMBER_MASK_ALLOW_DECIMAL_AND_POSITIVE,
} from '@/utils/common';

interface IArrowInputProps
  extends Omit<TextFieldProps, 'value' | 'onChange' | 'disabled'> {
  value: string;
  onChange: (value: string) => void;
  placeHolderColor?: string;
  disabled?: boolean;
  isAllowNegative?: boolean;
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
    showArrowIcon = true,
    error = false,
    onBlur,
    ...arrowInputProps
  } = props;
  const theme = useTheme();

  const maskOption = (() => {
    if (isAllowDecimal && isAllowNegative) {
      return NUMBER_MASK_ALLOW_DECIMAL_AND_POSITIVE;
    }
    if (isAllowDecimal) {
      return NUMBER_MASK_ALLOW_DECIMAL;
    }
    if (isAllowNegative) {
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
          color={disabled ? theme.palette.text.secondary : ('#908BA5' as any)}
          onClick={disabled ? () => null : onClickUp}
        />
        <ArrowDownIcon
          color={disabled ? theme.palette.text.secondary : ('#908BA5' as any)}
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
    onChange(e.target.value);
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    if (value?.length === 0 || !value) {
      //  set value to zero when onBlur if field is empty
      onChange('0');
    }
    onBlur?.(e);
  };

  return (
    <TextField
      {...arrowInputProps}
      variant="standard"
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
        },
        ...arrowInputProps.sx,
      }}
      InputProps={{
        inputComponent: TextMask as any,
        endAdornment: showArrowIcon ? (
          <Box sx={{ mr: 2, ml: 4 }}>{renderArrow()}</Box>
        ) : null,
        ...arrowInputProps.InputProps,
      }}
      // eslint-disable-next-line react/jsx-no-duplicate-props
      inputProps={{
        ...(isAllowNegative
          ? {
              ...NUMBER_INVENTORY_MASK_ALLOW_NEGATIVE,
              overwrite: false,
            }
          : {
              ...NUMBER_INVENTORY_MASK_POSITIVE_ONLY,
              overwrite: false,
            }),
        ...(isAllowDecimal && {
          ...NUMBER_MASK_ALLOW_DECIMAL,
          overwrite: false,
        }),
        ...arrowInputProps.inputProps,
      }}
      onBlur={handleBlur}
      disabled={disabled}
      onChange={onChangeValue}
      value={value}
    />
  );
};

export default ArrowInput;
