import TextMask from '@/components/shared-components/TextMask';
import {
  PHONE_MASK_START_WITHOUT_ZERO,
  PHONE_MASK_START_WITH_ZERO,
} from '@/constants/phone';
import { formatPhoneNumberToString } from '@/utils';
import {
  PHONE_PLACEHOLDER,
  VIETNAMESE_MOBILE_COUNTRY_CODE,
} from '@/utils/constants';
import { InputAdornment } from '@mui/material';
import { useState } from 'react';
import { TextFieldElement, useFormContext } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { IShipperContactForm, ShipperContactFieldsEnum } from '../types';

export const ShipperPhoneInput = () => {
  const formContext = useFormContext<IShipperContactForm>();
  const { t } = useTranslation();
  const [phoneStartedWithZero, setPhoneStartedWithZero] = useState(false);

  const onBlurPhoneNumber = (e: any) => {
    if (phoneStartedWithZero) {
      formContext.setValue(
        ShipperContactFieldsEnum.Phone,
        formatPhoneNumberToString(e?.target.value ?? '')
      );
      setPhoneStartedWithZero(false);
    }
  };

  const onChangePhoneNumber = (e: any) => {
    const phone = e.target.value;
    if (phone?.[0] === '0') {
      setPhoneStartedWithZero(true);
    } else {
      setPhoneStartedWithZero(false);
    }
    return phone;
  };

  return (
    <TextFieldElement
      fullWidth
      name={ShipperContactFieldsEnum.Phone}
      label={t('phone')}
      placeholder={PHONE_PLACEHOLDER}
      sx={{
        mt: 8,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            +{VIETNAMESE_MOBILE_COUNTRY_CODE}
          </InputAdornment>
        ),
        inputComponent: TextMask as any,
        onBlur: onBlurPhoneNumber,
      }}
      inputProps={{
        autoComplete: 'disabled',
        mask: phoneStartedWithZero
          ? PHONE_MASK_START_WITH_ZERO
          : PHONE_MASK_START_WITHOUT_ZERO,
      }}
      onChange={onChangePhoneNumber}
      InputLabelProps={{
        shrink: true,
      }}
      required
    />
  );
};
