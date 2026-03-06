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
import TextMask from '@/components/shared-components/TextMask';
import { useAppSelector } from '@/hooks/useStore';
import { companySelectors } from '@/store/slices/company';
import { formatPhoneNumberToString } from '@/utils';
import { PHONE_PLACEHOLDER, mediaMobileMax } from '@/utils/constants';
import { renderMaskCompanyPhone } from '@/utils/phone';
import { AreaPickerElement } from '../../form/AreaPickerElement';
import { AddEditDeliveryAddressEnum } from './constants';
import {
  IAddEditDeliveryAddressForm,
  IAddEditDeliveryAddressModalProps,
} from './types';
import { useYupSchema } from './useYupSchema';

export const AddEditDeliveryAddressModal = (
  props: IAddEditDeliveryAddressModalProps
) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    mode = 'add',
    deliveryAddress = null,
    onConfirm,
    onCancel,
    showSetDefaultCheckbox = true,
    setDefaultDeliveryAddress = false,
    colorTheme = theme.palette.primary.main,
    ...restProps
  } = props;
  const isEdit = mode === 'edit';
  const [phoneStartedWithZero, setPhoneStartedWithZero] = useState(false);
  const currentCompany = useAppSelector(companySelectors.getCompany)!;
  const initialDefaultFormValues = {
    [AddEditDeliveryAddressEnum.Name]: '',
    [AddEditDeliveryAddressEnum.Mobile]: '',
    [AddEditDeliveryAddressEnum.Area]: null,
    [AddEditDeliveryAddressEnum.Address]: '',
    [AddEditDeliveryAddressEnum.IsDefault]: setDefaultDeliveryAddress ?? false,
  };

  const formContext = useForm<IAddEditDeliveryAddressForm>({
    defaultValues:
      initialDefaultFormValues as unknown as IAddEditDeliveryAddressForm,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: (data, context, options) =>
      useYupSchema({ data, context, options }),
  });

  const { setValue, watch } = formContext;
  const [phoneValue, setPhoneValue] = useState(null);

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

  const onChangePhoneNumber = (e: any) => {
    const phone = e.target.value;
    setPhoneValue(phone);
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
          [mediaMobileMax]: {
            '& .MuiDialogContent-title': {
              fontSize: `${theme.spacing(5)} !important`,
            },
            '& p, & div, & span, & label, & input': {
              fontSize: theme.spacing(3.5),
            },
          },
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
            [mediaMobileMax]: {
              p: 4,
            },
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
        <DialogContent
          sx={{
            [mediaMobileMax]: {
              p: 4,
            },
          }}
        >
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
                  +
                  {deliveryAddress?.mobile_country_code ||
                    currentCompany?.mobile_country_code}
                </InputAdornment>
              ),
              inputComponent: TextMask as any,
              onBlur: onBlurPhoneNumber,
            }}
            inputProps={{
              autoComplete: 'disabled',
              mask: renderMaskCompanyPhone(
                (phoneValue ?? '').length,
                phoneStartedWithZero
              ),
              overwrite: false,
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
                    disabled={
                      deliveryAddress?.is_default || setDefaultDeliveryAddress
                    }
                    onChange={onChangeIsDefault}
                  />
                }
                label={t('set_default_address')}
                sx={{
                  '& > .Mui-checked': {
                    color: `${colorTheme} !important`,
                  },
                }}
              />
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            pt: theme.spacing(4),
            gap: theme.spacing(4),
            [mediaMobileMax]: {
              px: 4,
              '& button': {
                width: '50%',
                p: `0 ${theme.spacing(2)}`,
              },
            },
          }}
        >
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
            sx={{
              backgroundColor: colorTheme,
            }}
          >
            {isEdit ? t('save') : t('add')}
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
};

export { FAKE_ADDRESS_ID_TO_BYPASS_FIELD_ID } from './constants';
