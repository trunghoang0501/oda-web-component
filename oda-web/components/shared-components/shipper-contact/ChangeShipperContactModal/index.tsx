import { Box, Button, Dialog, useTheme } from '@mui/material';
import { isEmpty } from 'rambda';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { AUTOCOMPLETE_OPTION_CUSTOMIZE_FAKE_ID } from '@/constants';
import { formatPhoneNumberToString } from '@/utils';
import { convertToPhone } from '@/utils/phone';
import { ShipperNameSelect } from './components/ShipperNameSelect';
import { ShipperPhoneInput } from './components/ShipperPhoneInput';
import { IChangeShipperContactModalProps, IShipperContactForm } from './types';
import { useYupSchema } from './useYupSchema';

export const ChangeShipperContactModal = (
  props: IChangeShipperContactModalProps
) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    shipper,
    shipperList = [],
    onCancel,
    onConfirm,
    ...restProps
  } = props;

  const initialDefaultFormValues: IShipperContactForm = {
    shipper: {
      id: AUTOCOMPLETE_OPTION_CUSTOMIZE_FAKE_ID,
      name: shipper?.name ?? '',
      phone: '',
    },
    phone: shipper?.phone
      ? convertToPhone(formatPhoneNumberToString(shipper.phone))
      : '',
  };

  const formContext = useForm<IShipperContactForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialDefaultFormValues,
    resolver: (formData, context, options) =>
      useYupSchema({ formData, context, options }),
  });

  const enableSubmitButton = useMemo(() => {
    if (
      isEmpty(formContext.formState.dirtyFields) ||
      !isEmpty(formContext.formState.errors)
    ) {
      return false;
    }

    return true;
  }, [formContext.formState]);

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = formContext.handleSubmit((formData, e) => {
    e?.preventDefault();

    onConfirm(
      {
        name: formData?.shipper?.name ?? '',
        phone: formatPhoneNumberToString(formData.phone || '', true),
      },
      formData
    );
  });

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: theme.spacing(4),
          boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
        },
      }}
      {...restProps}
    >
      <Box>
        <FormContainer formContext={formContext} handleSubmit={handleSubmit}>
          <Box
            sx={{
              p: 6,
              fontSize: theme.spacing(8.5),
              lineHeight: theme.spacing(11.5),
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {t('change_shipper_contact')}
          </Box>

          <Box px={8} mt={4}>
            <ShipperNameSelect shipperList={shipperList} />
            <ShipperPhoneInput />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: theme.spacing(8, 4, 8, 4),
              mx: theme.spacing(2),
            }}
          >
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              {t('cancel')}
            </Button>

            <Button
              variant="contained"
              type="submit"
              sx={{
                ml: 4,
              }}
              disabled={!enableSubmitButton}
            >
              {t('confirm')}
            </Button>
          </Box>
        </FormContainer>
      </Box>
    </Dialog>
  );
};

export * from './types';
