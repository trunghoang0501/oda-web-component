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
import { AreaPickerElement } from '@/components/shared-components/form/AreaPickerElement';
import { SHIPPING_FEE_DEFAULT } from '@/constants';
import { useAppSelector } from '@/hooks/useStore';
import { companySelectors } from '@/store/slices/company';
import { formatPhoneNumberToString } from '@/utils';
import { PHONE_PLACEHOLDER, mediaMobileMax } from '@/utils/constants';
import { renderMaskCompanyPhone } from '@/utils/phone';
import { DeliveryFeeInput } from './components/DeliveryFeeInput';
import { AddEditPartnerDeliveryAddressEnum } from './constants';
import {
  IAddEditPartnerDeliveryAddressForm,
  IAddEditPartnerDeliveryAddressModalProps,
} from './types';
import { useYupSchema } from './useYupSchema';

export const AddEditPartnerDeliveryAddressModal = (
  props: IAddEditPartnerDeliveryAddressModalProps
) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    mode = 'add',
    deliveryAddress = null,
    statusPartnerIsLink = false,
    onConfirm,
    onCancel,
    showSetDefaultCheckbox = true,
    setDefaultDeliveryAddress = false,
    ...restProps
  } = props;
  const isEdit = mode === 'edit';
  const [phoneStartedWithZero, setPhoneStartedWithZero] = useState(false);
  const currentCompany = useAppSelector(companySelectors.getCompany)!;
  interface IInputAddEditDeliveryAddressForm {
    [AddEditPartnerDeliveryAddressEnum.Name]: string;
    [AddEditPartnerDeliveryAddressEnum.Mobile]: string;
    [AddEditPartnerDeliveryAddressEnum.Area]: {
      city: null;
      district: null;
    };
    [AddEditPartnerDeliveryAddressEnum.Address]: string;
    [AddEditPartnerDeliveryAddressEnum.IsDefault]: boolean;
    [AddEditPartnerDeliveryAddressEnum.DeliveryFee]: number | string;
  }

  const initialDefaultFormValues: IInputAddEditDeliveryAddressForm = {
    [AddEditPartnerDeliveryAddressEnum.Name]: '',
    [AddEditPartnerDeliveryAddressEnum.Mobile]: '',
    [AddEditPartnerDeliveryAddressEnum.Area]: {
      city: null,
      district: null,
    },
    [AddEditPartnerDeliveryAddressEnum.Address]: '',
    [AddEditPartnerDeliveryAddressEnum.DeliveryFee]: SHIPPING_FEE_DEFAULT,
    [AddEditPartnerDeliveryAddressEnum.IsDefault]:
      setDefaultDeliveryAddress ?? false,
  };

  const formContext = useForm<IAddEditPartnerDeliveryAddressForm>({
    defaultValues:
      initialDefaultFormValues as unknown as IAddEditPartnerDeliveryAddressForm,
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
        AddEditPartnerDeliveryAddressEnum.Mobile,
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

  const onChangeIsDefault = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(
      AddEditPartnerDeliveryAddressEnum.IsDefault,
      event.target.checked,
      {
        shouldDirty: true,
      }
    );
  };

  useEffect(() => {
    if (!isEdit || !deliveryAddress) {
      return;
    }

    formContext.reset({
      [AddEditPartnerDeliveryAddressEnum.Name]: deliveryAddress.name,
      [AddEditPartnerDeliveryAddressEnum.Mobile]: deliveryAddress.mobile,
      [AddEditPartnerDeliveryAddressEnum.Area]: {
        city: deliveryAddress.city,
        district: deliveryAddress.district,
      },
      [AddEditPartnerDeliveryAddressEnum.Address]: deliveryAddress.address,
      [AddEditPartnerDeliveryAddressEnum.IsDefault]:
        setDefaultDeliveryAddress || deliveryAddress.is_default,
      [AddEditPartnerDeliveryAddressEnum.DeliveryFee]:
        deliveryAddress.delivery_fee,
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
            '& .MuiDialogTitle-root': {
              fontSize: `${theme.spacing(5)}!important`,
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
          sx={{
            pb: theme.spacing(6),
            [mediaMobileMax]: {
              fontSize: `${theme.spacing(5)}!important`,
            },
          }}
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
            sx={{
              [mediaMobileMax]: {
                fontSize: `${theme.spacing(4)}!important`,
              },
            }}
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
            name={AddEditPartnerDeliveryAddressEnum.Name}
            label={t('name')}
            placeholder={t('enter_name')}
            inputProps={{
              autoComplete: 'disabled',
            }}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={statusPartnerIsLink}
            required
          />

          <TextFieldElement
            fullWidth
            sx={{ mb: 8 }}
            name={AddEditPartnerDeliveryAddressEnum.Mobile}
            label={t('phone')}
            placeholder={PHONE_PLACEHOLDER}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    color: statusPartnerIsLink ? 'unset' : undefined,
                  }}
                >
                  +{currentCompany?.mobile_country_code}
                </InputAdornment>
              ),
              inputComponent: TextMask as any,
              onBlur: onBlurPhoneNumber,
            }}
            inputProps={{
              autoComplete: 'disabled',
              mask: renderMaskCompanyPhone(
                (
                  formContext.watch(AddEditPartnerDeliveryAddressEnum.Mobile) ??
                  ''
                ).length,
                phoneStartedWithZero
              ),
              overwrite: false,
            }}
            onChange={onChangePhoneNumber}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={statusPartnerIsLink}
            required
          />

          <AreaPickerElement
            name={AddEditPartnerDeliveryAddressEnum.Area}
            textFieldProps={{ disabled: statusPartnerIsLink }}
          />

          <TextFieldElement
            fullWidth
            sx={{ mb: 8, mt: 8 }}
            name={AddEditPartnerDeliveryAddressEnum.Address}
            label={t('address')}
            placeholder={t('enter_address')}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              autoComplete: 'disabled',
            }}
            disabled={statusPartnerIsLink}
            required
          />

          <DeliveryFeeInput />

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
                    name={AddEditPartnerDeliveryAddressEnum.IsDefault}
                    checked={watch(AddEditPartnerDeliveryAddressEnum.IsDefault)}
                    disabled={
                      deliveryAddress?.is_default ||
                      statusPartnerIsLink ||
                      setDefaultDeliveryAddress
                    }
                    onChange={onChangeIsDefault}
                  />
                }
                label={t('set_default_address')}
              />
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            pt: theme.spacing(4),
            gap: theme.spacing(4),
            [mediaMobileMax]: {
              '& button': {
                width: '100%',
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
          >
            {isEdit ? t('save') : t('add')}
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
};

export { FAKE_ADDRESS_ID_TO_BYPASS_FIELD_ID } from './constants';
