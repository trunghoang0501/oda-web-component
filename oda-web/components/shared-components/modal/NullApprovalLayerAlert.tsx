import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useMyModal } from '@/hooks/useMyModal';
import { getApprovalSettingUrl } from '@/utils';

// Component for the alert content
const NullApprovalLayerAlertContent = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography
        fontSize={theme.spacing(4.5)}
        lineHeight={theme.spacing(6)}
        fontWeight={600}
        mb={4}
      >
        {t('null_approval_layer_alert')}
      </Typography>
    </Box>
  );
};

interface ShowAlertParams {
  myModal: ReturnType<typeof useMyModal>;
  t: (key: string) => string;
  router: ReturnType<typeof useRouter>;
}

// Utility function to show the modal
export const showNullApprovalLayerAlert = ({
  myModal,
  t,
  router,
}: ShowAlertParams) => {
  const instanceModal = myModal.confirmInfo({
    modalTitle: (
      <span style={{ textTransform: 'capitalize' }}>{t('notification')}</span>
    ),
    modalContent: <NullApprovalLayerAlertContent />,
    confirmButtonLabel: t('ok'),
    onClickConfirmButton: async () => {
      instanceModal.hide();
      router.push(getApprovalSettingUrl());
    },
    onClickCancelButton: () => {
      instanceModal.hide();
    },
  });

  return instanceModal;
};

export default NullApprovalLayerAlertContent;
