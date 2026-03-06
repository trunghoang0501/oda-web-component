import { InputAdornment } from '@mui/material';
import { useState } from 'react';
import { TextFieldElement, useFormContext } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import TextMask from '@/components/shared-components/TextMask';
import {
  PHONE_MASK_START_WITHOUT_ZERO,
  PHONE_MASK_START_WITH_ZERO,
} from '@/constants/phone';
import { useAppSelector } from '@/hooks/useStore';
import { companySelectors } from '@/store/slices/company';
import { formatPhoneNumberToString } from '@/utils';
import { PHONE_PLACEHOLDER } from '@/utils/constants';
import { IShipperContactForm, ShipperContactFieldsEnum } from '../types';

export const ShipperPhoneInput = () => {
  const formContext = useFormContext<IShipperContactForm>();
  const { t } = useTranslation();
  const [phoneStartedWithZero, setPhoneStartedWithZero] = useState(false);
  const currentCompany = useAppSelector(companySelectors.getCompany)!;
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
            +{currentCompany?.mobile_country_code}
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
    />
  );
};
