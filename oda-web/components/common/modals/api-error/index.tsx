import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  useTheme,
} from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { equals } from 'rambda';
import * as React from 'react';
import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PERMISSION_STATUS_CODE } from '@/constants';
import { useAppSelector } from '@/hooks/useStore';
import { dispatch } from '@/store/app-dispatch';
import { clearApiError } from '@/store/slices/app';

// Styled Item
const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  margin: 'auto',
  width: theme.spacing(110),
  padding: 0,
  '& .MuiDialogContent-group-title': {
    '& .MuiDialogContent-title': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
      textAlign: 'center',
    },
  },
  '& .MuiAlert-icon': {
    svg: {
      color: theme.palette.text.primary,
    },
  },
}));

const ApiError = () => {
  const theme = useTheme();

  const apiError = useAppSelector((state) => state?.app?.apiError);

  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  // close modal and clear error from api
  const onClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => dispatch(clearApiError()), 500);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  // trigger when call api error with code != 200
  useEffect(() => {
    if (
      apiError?.code !== undefined &&
      apiError?.code !== PERMISSION_STATUS_CODE
    ) {
      onOpen();
    }
  }, [apiError]);

  const message = React.useMemo(
    () =>
      (apiError?.code || 0) >= 500 && (apiError?.code || 0) < 600
        ? t('error:server_program_error_occurred')
        : t('error:network_error_occurred'),
    [apiError]
  );

  return (
    <DialogStyled open={open} onClose={onClose}>
      <DialogTitle className="MuiDialogContent-title">
        <WarningAmberRoundedIcon
          sx={{ fontSize: theme.spacing(14) }}
          color="error"
        />
        <Box className="MuiDialogContent-group-title">
          <Typography
            color="error"
            className="MuiDialogContent-title"
            variant="body1"
          >
            {t('dialog:error')}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box className="MuiDialogContent-group-title">
            <Typography className="MuiDialogContent-title" variant="body1">
              [{apiError?.code}] {message}
            </Typography>
          </Box>
          <Alert
            sx={{
              backgroundColor: 'transparent',
              color: theme.palette.text.primary,
              textAlign: 'left',
            }}
            severity="error"
          >
            {t(
              'dialog:if_the_problem_persists_please_contact_customer_service'
            )}
          </Alert>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          color="error"
          onClick={onClose}
        >
          {t('confirm')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};

export default memo(ApiError, equals);
