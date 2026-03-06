import { SHIPPING_FEE_DEFAULT } from '@/constants';
import { FormControl, InputLabel, TextField } from '@mui/material';
import { debounce } from 'debounce';
import { ChangeEvent } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AddEditPartnerDeliveryAddressEnum } from '../constants';
import { IAddEditPartnerDeliveryAddressForm } from '../types';

export const DeliveryFeeInput = () => {
  const { t } = useTranslation();
  const formContext = useFormContext<IAddEditPartnerDeliveryAddressForm>();
  const { field } = useController({
    control: formContext.control,
    name: AddEditPartnerDeliveryAddressEnum.DeliveryFee,
  });

  const updateToForm = debounce((val: number) => {
    field.onChange(val);
  }, 0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === '') {
      updateToForm(SHIPPING_FEE_DEFAULT);
    }
    if (regex.test(e.target.value)) {
      updateToForm(Number(e.target.value));
    }
  };

  return (
    <FormControl fullWidth sx={{ mb: 8 }}>
      <InputLabel shrink>{t('delivery_fee')}</InputLabel>
      <TextField
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        name={AddEditPartnerDeliveryAddressEnum.DeliveryFee}
        defaultValue={SHIPPING_FEE_DEFAULT}
        type="number"
        placeholder={t('enter_delivery_fee')}
        fullWidth
        multiline
        value={field.value}
      />
    </FormControl>
  );
};
