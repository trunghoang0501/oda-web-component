import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Box,
  Button,
  Dialog,
  DialogProps,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface IWarningPermissionModalProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const WarningPermissionModal = (props: IWarningPermissionModalProps) => {
  const { open, onClose, onConfirm, ...restProps } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} {...restProps}>
      <Box textAlign="center" p={8}>
        <WarningAmberRoundedIcon
          sx={{ fontSize: theme.spacing(20) }}
          color="error"
        />
        <Box mt={12}>
          <Typography fontSize={theme.spacing(4.5)} fontWeight={600}>
            {t('notification')}
          </Typography>
          <Typography mt={2} fontSize={theme.spacing(3.5)}>
            {t('dialog:you_do_not_have_permission_to_access_this_feature')}
          </Typography>
        </Box>
        <Box mt={12}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onConfirm}
            sx={{
              textTransform: 'uppercase',
              color: theme.palette.text.primary,
              borderColor: `${theme.palette.text.primary} !important}`,
            }}
          >
            {t('question:ok')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
