import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import {
  Box,
  InputAdornment,
  StandardTextFieldProps,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TextMask from '@/components/shared-components/TextMask';
import { SettingSupplierEmailForm } from '@/containers/partners/partner-message-setting-detail/types';
import useMobileDetect from '@/hooks/useMobileDetect';
import { useAppSelector } from '@/hooks/useStore';
import { translate } from '@/i18n/translate';
import { companySelectors } from '@/store/slices/company';
import { IContactInformationInSetting } from '@/types/partner-setting';
import {
  formatPhoneNumberToString,
  removeFirstZero,
  removeSpaceAtLast,
  removeSpaceWithZero,
} from '@/utils';
import { formatByTypePhoneNumber, getLengthPhoneNumber } from '@/utils/phone';
import { HtmlTooltipStyled } from '../../LogoStack/styles';
import { TextMaskTypeEnum } from './constants';

interface IZaloInputFieldProps extends StandardTextFieldProps {
  defaultValue: string;
  placeholder?: string;
  partnerIndex: number;
  status: boolean | null;
  shouldRemoveZero?: boolean;
  cbOnChange: (value: string) => void;
  listenError?: (isError: boolean) => void;
}

const ZaloInputField = (props: IZaloInputFieldProps) => {
  const {
    defaultValue,
    partnerIndex,
    status = false,
    placeholder = '123456789',
    cbOnChange,
    shouldRemoveZero = true,
    required = false,
    listenError,
    ...rest
  } = props;

  const theme = useTheme();
  const { t } = useTranslation();
  const formContext = useFormContext<SettingSupplierEmailForm>();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const currentCompany = useAppSelector(companySelectors.getCompany)!;
  // const isStartWithZero = phoneNumber.startsWith('0');
  const isError = Boolean(error);

  const partner = formContext.watch().partners[partnerIndex];
  const mobileCountryCode =
    partner?.vendor?.remote?.mobile_country_code ||
    currentCompany?.mobile_country_code;

  const details = formContext.watch().partners[partnerIndex].detail;
  const phones = details.map((detail: IContactInformationInSetting) =>
    formatPhoneNumberToString(detail.value, true)
  );
  const duplicates = phones.filter(
    (item: string, idx: number) => phones.indexOf(item) !== idx
  );

  useEffect(() => {
    setPhoneNumber(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    if (listenError) {
      listenError(isError);
    }
  }, [isError]);

  useEffect(() => {
    const errorMsg = validateZaloPhone(phoneNumber, required, 4, 14);
    setError(errorMsg);

    if (
      phoneNumber &&
      duplicates.includes(formatPhoneNumberToString(phoneNumber, true))
    ) {
      setError('phone_is_already_in_use_try_another_phone');
    }
  }, [phoneNumber, duplicates]);

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setPhoneNumber(formatPhoneNumberToString(newValue));
    cbOnChange(formatPhoneNumberToString(newValue));
  };

  const handlePhoneNumberBlur = () => {
    const newValue = formatPhoneNumberToString(phoneNumber);
    setPhoneNumber(newValue);
    cbOnChange(newValue);
  };

  const handleKeyDown = (event: any) => {
    if (
      event.code === 'Backspace' &&
      phoneNumber[phoneNumber.length - 1] === ' '
    ) {
      setPhoneNumber(removeSpaceAtLast(phoneNumber));
    }
  };
  const mobileDetect = useMobileDetect();
  const renderStatusPhone = () => {
    if (mobileDetect.isMobile() || status === null) {
      return null;
    }
    if (status) {
      return (
        <InputAdornment
          position="end"
          sx={{
            cursor: 'pointer',
          }}
        >
          <HtmlTooltipStyled
            title={
              <Box>
                <Typography
                  color={theme.palette.customColors.tableText}
                  fontSize={theme.spacing(3.5)}
                  lineHeight={theme.spacing(5)}
                >
                  {t('zalo_account_has_followed_oda_zalo')}
                </Typography>
              </Box>
            }
          >
            <PrivacyTipOutlinedIcon color="success" />
          </HtmlTooltipStyled>
        </InputAdornment>
      );
    }
    return (
      <InputAdornment
        position="end"
        sx={{
          cursor: 'pointer',
        }}
      >
        <HtmlTooltipStyled
          title={
            <Box>
              <Typography
                color={theme.palette.customColors.tableText}
                fontSize={theme.spacing(3.5)}
                lineHeight={theme.spacing(5)}
              >
                {t('zalo_account_has_not_followed_oda_zalo')}
              </Typography>
            </Box>
          }
        >
          <PrivacyTipOutlinedIcon color="error" />
        </HtmlTooltipStyled>
      </InputAdornment>
    );
  };

  const validateZaloPhone = (
    value: string,
    isRequired = true,
    minLength = 4,
    maxLength = 14
  ) => {
    if (isRequired && !value) {
      return translate('validate:enter_$field', {
        field: translate('zalo_phone'),
      });
    }
    if (value) {
      if (value.length < minLength || value.length > maxLength) {
        return translate(
          'dialog:$field_must_be_between_$min_and_$max_in_length',
          {
            field: translate('zalo_phone'),
            min: minLength,
            max: maxLength,
          }
        );
      }
    }
    return ''; // No error
  };

  return (
    <TextField
      {...rest}
      fullWidth
      value={phoneNumber}
      InputLabelProps={{
        shrink: true,
      }}
      label={t('zalo_phone')}
      onChange={handlePhoneNumberChange}
      onBlur={handlePhoneNumberBlur}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography>+{mobileCountryCode}</Typography>
          </InputAdornment>
        ),
        inputComponent: TextMask as any,
        endAdornment: renderStatusPhone(),
      }}
      inputProps={{
        autoComplete: 'off',
        placeholder,
        overwrite: true,
        name: 'zalo-phone',
      }}
      sx={{
        flexGrow: 1,
        marginBottom: 0,
        '.MuiInputBase-root': {
          height: theme.spacing(10),
          '& .MuiInputBase-input': {
            padding: theme.spacing(2, 3, 2, 0),
          },
        },
      }}
      error={isError}
      helperText={t(error)}
      required={false}
    />
  );
};

export default ZaloInputField;
