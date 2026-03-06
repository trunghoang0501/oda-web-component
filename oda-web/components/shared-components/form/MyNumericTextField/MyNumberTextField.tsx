import {
  Box,
  BoxProps,
  FormHelperText,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import deepmerge from 'deepmerge';
import { INumericFormatCustomInputProps } from '@/components/shared-components/form/NumericFormatCustomInput';
import NumericFormatCustomInputTypeNumber from '@/components/shared-components/form/NumericFormatCustomInputTypeNumber';
import { DEFAULT_NUMBER_DECIMAL_SCALE_MAX } from '@/constants';

export interface IMyNumberTextFieldProps {
  value?: number | string | null;
  inputRef?: INumericFormatCustomInputProps['ref'];
  defaultValue?: number | string;
  onChange?: (value: number) => void;
  onFocus?: TextFieldProps['onFocus'];
  onBlur?: TextFieldProps['onBlur'];
  allowDecimal?: boolean;
  minValue?: number;
  maxValue?: number;
  sx?: BoxProps['sx'];
  disabled?: boolean;
  error?: boolean;
  helperMessage?: string;
  numberDecimalScale?: number;
  allowNegative?: boolean;
}

const DEFAULT_MAX_VALUE = 9999;
const DEFAULT_MAX_VALUE_NEGATIVE = -9999;

/**
  - How to build controlled component with this component: https://github.com/s-yadav/react-number-format/issues/749
*/
const MyNumberTextField = (props: IMyNumberTextFieldProps) => {
  const theme = useTheme();
  const {
    sx = {},
    value,
    inputRef,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    allowDecimal,
    minValue = 0,
    maxValue = DEFAULT_MAX_VALUE,
    disabled,
    error,
    helperMessage,
    numberDecimalScale = DEFAULT_NUMBER_DECIMAL_SCALE_MAX,
    allowNegative,
  } = props;

  const handleOnInputChange: INumericFormatCustomInputProps['onChange'] = (
    e
  ) => {
    onChange?.(Number(e.target.value));
  };

  return (
    <Box
      sx={deepmerge.all<BoxProps['sx']>([
        {
          '.my-numeric-input': {
            height: theme.spacing(10),
            fontSize: theme.spacing(4),
            borderRadius: theme.spacing(1.5),
            border: `1px solid ${
              error ? theme.palette.error.dark : theme.palette.text.secondary
            }`,
            color: theme.palette.text.primary,
            outline: 'none',
            background: theme.palette.common.white,
            opacity: disabled ? 0.5 : undefined,
            '&:focus': {
              borderColor: theme.palette.text.primary,
            },
          },
          position: 'relative',
        },
        sx,
      ])}
    >
      <NumericFormatCustomInputTypeNumber
        className="my-numeric-input"
        ref={inputRef}
        name="NumericFormatCustomInput"
        value={value}
        defaultValue={defaultValue}
        onChange={handleOnInputChange}
        allowNegative={allowNegative}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        isAllowed={(values) => {
          const newValue = Number(values.value);
          const min = allowNegative ? DEFAULT_MAX_VALUE_NEGATIVE : minValue;

          return newValue >= min && newValue <= maxValue;
        }}
        decimalScale={allowDecimal ? numberDecimalScale : 0}
      />

      {helperMessage && (
        <FormHelperText error={error}>{helperMessage}</FormHelperText>
      )}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          onClick={() => {
            const newValue = Number(value ?? 0) + 1;
            const min = allowNegative ? DEFAULT_MAX_VALUE_NEGATIVE : minValue;
            if (newValue >= min && newValue <= maxValue) {
              onChange?.(newValue);
            }
          }}
          sx={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: `6px solid ${theme.palette.text.primary}`,
            mt: 2,
          }}
        />
        <Box
          onClick={() => {
            const newValue = Number(value ?? 0) - 1;
            const min = allowNegative ? DEFAULT_MAX_VALUE_NEGATIVE : minValue;
            if (newValue >= min && newValue <= maxValue) {
              onChange?.(newValue);
            }
          }}
          sx={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${theme.palette.text.primary}`,
            mt: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default MyNumberTextField;
