import TextMask from '@/components/shared-components/TextMask';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Typography,
  useTheme,
} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { isEmpty } from 'rambda';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { formatPhoneNumberToString } from 'src/utils';
import {
  PHONE_PLACEHOLDER,
  VIETNAMESE_MOBILE_COUNTRY_CODE,
} from 'src/utils/constants';
import { AreaPickerElement } from '../../form/AreaPickerElement';
import { AddEditDeliveryAddressEnum } from './constants';
import {
  IAddEditDeliveryAddressForm,
  IAddEditDeliveryAddressModalProps,
} from './types';
import { useYupSchema } from './useYupSchema';

export const initialDefaultFormValues = {
  [AddEditDeliveryAddressEnum.Name]: '',
  [AddEditDeliveryAddressEnum.Mobile]: '',
  [AddEditDeliveryAddressEnum.Area]: null,
  [AddEditDeliveryAddressEnum.Address]: '',
  [AddEditDeliveryAddressEnum.IsDefault]: false,
};

export const AddEditDeliveryAddressModal = (
  props: IAddEditDeliveryAddressModalProps
) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    mode = 'add',
    deliveryAddress = null,
    showSetDefaultCheckbox = false,
    onConfirm,
    onCancel,
    ...restProps
  } = props;
  const isEdit = mode === 'edit';
  const [phoneStartedWithZero, setPhoneStartedWithZero] = useState(false);

  const formContext = useForm<IAddEditDeliveryAddressForm>({
    defaultValues:
      initialDefaultFormValues as unknown as IAddEditDeliveryAddressForm,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: (data, context, options) =>
      useYupSchema({ data, context, options }),
  });

  const { setValue, watch } = formContext;

  const enableSubmitButton = useMemo(() => {
    if (
      isEmpty(formContext.formState.dirtyFields) ||
      !isEmpty(formContext.formState.errors)
    ) {
      return false;
    }

    return true;
  }, [formContext.formState]);

  const onBlurPhoneNumber = (e: any) => {
    if (phoneStartedWithZero) {
      setValue(
        AddEditDeliveryAddressEnum.Mobile,
        formatPhoneNumberToString(e?.target.value ?? '')
      );
      setPhoneStartedWithZero(false);
    }
  };

  const onChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    if (phone?.[0] === '0') {
      setPhoneStartedWithZero(true);
    } else {
      setPhoneStartedWithZero(false);
    }
    return phone;
  };

  const onChangeIsDefault = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(AddEditDeliveryAddressEnum.IsDefault, event.target.checked, {
      shouldDirty: true,
    });
  };

  useEffect(() => {
    if (!isEdit || !deliveryAddress) {
      return;
    }

    formContext.reset({
      [AddEditDeliveryAddressEnum.Name]: deliveryAddress.name,
      [AddEditDeliveryAddressEnum.Mobile]: deliveryAddress.mobile,
      [AddEditDeliveryAddressEnum.Area]: {
        city: deliveryAddress.city,
        district: deliveryAddress.district,
      },
      [AddEditDeliveryAddressEnum.Address]: deliveryAddress.address,
      [AddEditDeliveryAddressEnum.IsDefault]: deliveryAddress.is_default,
    });
  }, [deliveryAddress]);

  const handleSubmit = formContext.handleSubmit((formData, e) => {
    e?.preventDefault();
    onConfirm(formData);
  });

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: theme.spacing(4),
          boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
        },
      }}
      scroll="body"
      {...restProps}
    >
      <FormContainer formContext={formContext} handleSubmit={handleSubmit}>
        <DialogTitle
          className="MuiDialogContent-title"
          sx={{ pb: theme.spacing(6) }}
        >
          {isEdit ? t('edit_delivery_address') : t('add_delivery_address')}
        </DialogTitle>
        <Box
          className="MuiDialogContent-group-title"
          sx={{
            p: theme.spacing(0, 8, 4),
          }}
        >
          <Typography
            className="MuiDialogContent-subTitle"
            variant="body1"
            fontWeight={600}
            fontSize={theme.spacing(4.5)}
            lineHeight={theme.spacing(6)}
          >
            {isEdit
              ? t('edit_delivery_address')
              : t('enter_new_delivery_address')}
          </Typography>
        </Box>
        <DialogContent>
          <TextFieldElement
            fullWidth
            sx={{ mb: 8 }}
            name={AddEditDeliveryAddressEnum.Name}
            label={t('name')}
            placeholder={t('enter_name')}
            inputProps={{
              autoComplete: 'disabled',
            }}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <TextFieldElement
            fullWidth
            sx={{ mb: 8 }}
            name={AddEditDeliveryAddressEnum.Mobile}
            label={t('phone')}
            placeholder={PHONE_PLACEHOLDER}
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
            }}
            onChange={onChangePhoneNumber}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <AreaPickerElement name={AddEditDeliveryAddressEnum.Area} />

          <TextFieldElement
            fullWidth
            sx={{ mb: 8, mt: 8 }}
            name={AddEditDeliveryAddressEnum.Address}
            label={t('address')}
            placeholder={t('enter_address')}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              autoComplete: 'disabled',
            }}
            required
          />
          {showSetDefaultCheckbox && (
            <FormGroup
              sx={{
                mb: 4,
                '& .MuiFormControlLabel-root': {
                  marginLeft: 0,
                },
                '& .MuiCheckbox-root': {
                  padding: 0,
                  marginRight: theme.spacing(2),
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name={AddEditDeliveryAddressEnum.IsDefault}
                    checked={watch(AddEditDeliveryAddressEnum.IsDefault)}
                    disabled={deliveryAddress?.is_default}
                    onChange={onChangeIsDefault}
                  />
                }
                label={t('set_default_address')}
              />
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions sx={{ pt: theme.spacing(4), gap: theme.spacing(2) }}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => onCancel()}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={!enableSubmitButton}
          >
            {isEdit ? t('save') : t('add')}
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
};
