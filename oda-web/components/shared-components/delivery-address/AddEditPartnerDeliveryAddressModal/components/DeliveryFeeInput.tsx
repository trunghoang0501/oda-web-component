import { FormControl, InputLabel } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MyNumericTextFieldElement from '@/components/shared-components/form/MyNumericTextFieldElement';
import { SHIPPING_FEE_DEFAULT } from '@/constants';
import { AddEditPartnerDeliveryAddressEnum } from '../constants';
import { IAddEditPartnerDeliveryAddressForm } from '../types';

export const DeliveryFeeInput = () => {
  const { t } = useTranslation();
  const formContext = useFormContext<IAddEditPartnerDeliveryAddressForm>();
  const errorMessage = Boolean(
    formContext.getFieldState(AddEditPartnerDeliveryAddressEnum.DeliveryFee)
      .error !== undefined
  );

  useEffect(() => {
    if (errorMessage) {
      formContext.setValue(
        AddEditPartnerDeliveryAddressEnum.DeliveryFee,
        SHIPPING_FEE_DEFAULT
      );
      formContext.clearErrors(AddEditPartnerDeliveryAddressEnum.DeliveryFee);
    }
  }, [errorMessage]);

  return (
    <FormControl fullWidth sx={{ mb: 8 }}>
      <InputLabel shrink>{t('delivery_fee')}</InputLabel>
      <MyNumericTextFieldElement
        name={AddEditPartnerDeliveryAddressEnum.DeliveryFee}
        textFieldProps={{
          placeholder: t('enter_delivery_fee'),
        }}
      />
    </FormControl>
  );
};
