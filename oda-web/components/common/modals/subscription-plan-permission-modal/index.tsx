import {
  Box,
  Button,
  DialogActions,
  Typography,
  useTheme,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreSubscriptionRequestMutation } from '@/apis';
import {
  EMAIL_INFORMATION,
  HOTLINE_INFORMATION,
  PERMISSION_STATUS_CODE,
  WORKING_TIME,
} from '@/constants';
import { PermissionEnum } from '@/constants/permission';
import { REQUEST_STATUS } from '@/containers/account/company/subscription-scene/constants';
import { useMyModal } from '@/hooks/useMyModal';
import { useRoute } from '@/hooks/useRoute';
import { useAppSelector } from '@/hooks/useStore';
import { dispatch } from '@/store/app-dispatch';
import { clearApiError } from '@/store/slices/app';
import { BoxInfoStyled, BoxStyled, DialogStyled } from './styles';

const SubscriptionPlanPermissionModal = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const route = useRoute();

  const myModal = useMyModal();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();
  const { apiError, userInfo, isStaffPermissionDenied } = useAppSelector(
    (state) => ({
      apiError: state?.app?.apiError,
      isStaffPermissionDenied: state.app.isStaffPermissionDenied,
      userInfo: state.user.userInfo,
    })
  );
  const [open, setOpen] = useState(false);

  const [
    storeSubscriptionRequest,
    { isLoading: storeSubscriptionRequestLoading },
  ] = useStoreSubscriptionRequestMutation();

  const hasStaffSalesPermission =
    userInfo.isOwner ||
    userInfo.permissions.some(
      (permission) => permission.permission_id === PermissionEnum.Sale
    );

  useEffect(() => {
    if (
      apiError?.code === PERMISSION_STATUS_CODE &&
      !isStaffPermissionDenied &&
      hasStaffSalesPermission
    ) {
      onOpen();
    }
  }, [apiError, hasStaffSalesPermission]);

  const onClose = () => {
    setOpen(false);
    setTimeout(() => dispatch(clearApiError()), 500);
    router.replace(route.firstDisplayPageRef.current);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const handleConfirm = async () => {
    onClose();

    try {
      const response = await storeSubscriptionRequest().unwrap();
      if (!response?.success) {
        const isExistRequest =
          response?.errors?.[0]?.field === REQUEST_STATUS.REQUEST_RECEIVED;

        if (isExistRequest) {
          openRequestReceivedModal();
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    }
  };

  const openRequestReceivedModal = () => {
    const instanceModal = myModal.confirmInfo({
      showCancelButton: false,
      confirmButtonLabel: t('ok'),
      modalTitle: (
        <Typography
          fontWeight={500}
          fontSize={theme.spacing(8.5)}
          color={theme.palette.text.primary}
          mb={5.5}
        >
          {t('request_received')}
        </Typography>
      ),
      modalContent: (
        <>
          <Typography
            fontSize={theme.spacing(3.5)}
            lineHeight={theme.spacing(5)}
          >
            {t(
              'oda_team_received_your_request_please_wait_for_us_to_contact_you'
            )}
          </Typography>
          <BoxInfoStyled>
            <Typography textTransform="capitalize">
              {t('landing_page:customer_service')}:
            </Typography>
            <Typography>
              {t('email')}: {EMAIL_INFORMATION} | {t('landing_page:hotline')}:{' '}
              {HOTLINE_INFORMATION}
            </Typography>
            <Typography textTransform="capitalize">
              {t('landing_page:service_hours')}:
            </Typography>
            <Typography>
              {t('landing_page:weekdays')}: {WORKING_TIME.normalDate.start}{' '}
              {t('to')} {WORKING_TIME.normalDate.end} |{' '}
              {t('landing_page:saturday')}: {WORKING_TIME.saturday.start}{' '}
              {t('to')} {WORKING_TIME.saturday.end}
            </Typography>
          </BoxInfoStyled>
        </>
      ),
      onClickConfirmButton: () => {
        instanceModal.hide();
      },
    });
  };

  return (
    <DialogStyled open={open} onClose={onClose}>
      <DialogTitle>{t('notification')}</DialogTitle>
      <Box className="MuiDialogContent-group-title">
        <Typography textAlign="left" fontSize={14}>
          {apiError.message}
        </Typography>
        <BoxStyled>
          <Typography textTransform="capitalize">
            {t('landing_page:customer_service')}:
          </Typography>
          <Typography>
            {t('email')}: {EMAIL_INFORMATION} | {t('landing_page:hotline')}:{' '}
            {HOTLINE_INFORMATION}
          </Typography>
          <Typography textTransform="capitalize">
            {t('landing_page:service_hours')}:
          </Typography>
          <Typography>
            {t('landing_page:weekdays')}: {WORKING_TIME.normalDate.start}{' '}
            {t('to')} {WORKING_TIME.normalDate.end} |{' '}
            {t('landing_page:saturday')}: {WORKING_TIME.saturday.start}{' '}
            {t('to')} {WORKING_TIME.saturday.end}
          </Typography>
        </BoxStyled>
      </Box>
      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          disabled={storeSubscriptionRequestLoading}
          onClick={handleConfirm}
        >
          {t('call_me_back')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};

export default SubscriptionPlanPermissionModal;
