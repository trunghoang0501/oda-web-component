import {
  removeFirstZero,
  removeSpaceAtLast,
  removeSpaceWithZero,
} from '@/utils';
import { VIETNAMESE_MOBILE_COUNTRY_CODE } from '@/utils/constants';
import { formatByTypePhoneNumber, getLengthPhoneNumber } from '@/utils/phone';
import {
  InputAdornment,
  StandardTextFieldProps,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextMaskTypeEnum } from './constants';

interface IPhoneInputFieldProps extends StandardTextFieldProps {
  defaultValue: string;
  placeholder?: string;
  shouldRemoveZero?: boolean;
  cbOnChange: (value: string) => void;
  listenError?: (isError: boolean) => void;
}

const PhoneInputField = (props: IPhoneInputFieldProps) => {
  const {
    defaultValue,
    placeholder = '123 - 456 - 789',
    cbOnChange,
    shouldRemoveZero = true,
    listenError,
    ...rest
  } = props;

  const theme = useTheme();
  const { t } = useTranslation();

  const [phoneNumber, setPhoneNumber] = useState<string>(() =>
    formatByTypePhoneNumber(defaultValue, TextMaskTypeEnum.NineNumber)
  );
  const [textMaskMode, setTextMaskMode] = useState<TextMaskTypeEnum>(
    TextMaskTypeEnum.NineNumber
  );
  const [error, setError] = useState<string>('');

  const isStartWithZero = phoneNumber.startsWith('0');
  const isTenNumberValid =
    getLengthPhoneNumber(phoneNumber, false) === 10 && isStartWithZero;
  const isNineNumberValid =
    getLengthPhoneNumber(phoneNumber) === 9 && !isStartWithZero;
  const isError = Boolean(error);

  useEffect(() => {
    if (getLengthPhoneNumber(defaultValue, false) === 10) {
      setTextMaskMode(TextMaskTypeEnum.TenNumber);
    }
    if (getLengthPhoneNumber(defaultValue) === 9) {
      setTextMaskMode(TextMaskTypeEnum.NineNumber);
    }
  }, []);

  useEffect(() => {
    if (listenError) {
      listenError(isError);
    }
  }, [isError]);

  useEffect(() => {
    if (textMaskMode === TextMaskTypeEnum.TenNumber && !isTenNumberValid) {
      setError('validate:phone_number_must_contain_10_digits');
    }

    if (textMaskMode === TextMaskTypeEnum.NineNumber && !isNineNumberValid) {
      setError('validate:phone_number_must_contain_9_digits');
    }

    if (isTenNumberValid || isNineNumberValid || phoneNumber.length === 0) {
      setError('');
    }
  }, [phoneNumber]);

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (
      (textMaskMode === TextMaskTypeEnum.TenNumber &&
        getLengthPhoneNumber(newValue, false) > 10) ||
      (textMaskMode === TextMaskTypeEnum.NineNumber &&
        getLengthPhoneNumber(newValue) > 9)
    ) {
      setError('');
      return;
    }

    if (newValue.length === 1) {
      if (newValue === '0') {
        setTextMaskMode(TextMaskTypeEnum.TenNumber);
        setError('validate:phone_number_must_contain_10_digits');
      } else {
        setTextMaskMode(TextMaskTypeEnum.NineNumber);
        setError('validate:phone_number_must_contain_9_digits');
      }
    }

    setPhoneNumber(formatByTypePhoneNumber(newValue, textMaskMode));
    cbOnChange(removeSpaceWithZero(newValue, shouldRemoveZero));
  };

  const handlePhoneNumberBlur = () => {
    const newValue = removeFirstZero(phoneNumber);

    if (isTenNumberValid) {
      setTextMaskMode(TextMaskTypeEnum.NineNumber);
      setPhoneNumber(newValue);
      cbOnChange(removeSpaceWithZero(newValue, shouldRemoveZero));
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.code === 'Backspace' && phoneNumber.length === 1) {
      setTextMaskMode(TextMaskTypeEnum.TenNumber);
    }
    if (
      event.code === 'Backspace' &&
      phoneNumber[phoneNumber.length - 1] === ' '
    ) {
      setPhoneNumber(removeSpaceAtLast(phoneNumber));
    }
  };

  return (
    <>
      <TextField
        {...rest}
        fullWidth
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        onBlur={handlePhoneNumberBlur}
        onKeyDown={handleKeyDown}
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Typography>+{VIETNAMESE_MOBILE_COUNTRY_CODE}</Typography>
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
        inputProps={{
          placeholder,
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderBottom: `1px solid ${theme.palette.text.secondary}`,
            '.MuiInputBase-input': {
              paddingY: theme.spacing(2),
            },
            '.MuiInputAdornment-root .MuiTypography-root': {
              color: '#3a35418a !important',
            },
          },
        }}
        error={isError}
        helperText={t(error)}
        required
      />
    </>
  );
};

export default PhoneInputField;
