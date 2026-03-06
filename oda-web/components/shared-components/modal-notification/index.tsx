import {
  Box,
  Button,
  DialogActions,
  Typography,
  useTheme,
} from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalNotificationProps } from './ModalNotification';

// Styled Item
const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
    borderRadius: theme.spacing(4),
  },
  '& .MuiDialogContent-noti': {
    lineHeight: 'initial',
    letterSpacing: 'initial',
    fontSize: `${theme.spacing(10)}`,
    fontWeight: 500,
  },
  '& .MuiDialogContent-title': {
    lineHeight: 'initial',
    letterSpacing: 'initial',
    fontSize: `${theme.spacing(8)}`,
  },
  '& .MuiDialogContent-group-title': {
    marginBottom: theme.spacing(4),
    paddingRight: theme.spacing(9),
    paddingLeft: theme.spacing(9),
    '& .MuiDialogContent-title': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
      textAlign: 'center',
    },
  },
}));

const ModalNotification = forwardRef<
  ModalNotificationRef,
  ModalNotificationProps
>(function FormDialog(
  {
    title,
    onClickConfirm,
    onClose: onCloseModal,
    showConfirm = true,
    showClose = true,
    confirmText,
    closeText,
  },
  ref
) {
  const theme = useTheme();

  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open === false && typeof onCloseModal === 'function') {
      onCloseModal?.();
    }
  }, [open]);

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      hide: onClose,
      open: onOpen,
    }),
    [ref]
  );

  return (
    <DialogStyled open={open} onClose={onClose}>
      <DialogTitle>
        <Typography className="MuiDialogContent-noti">
          {t('notification')}
        </Typography>
      </DialogTitle>
      <Box className="MuiDialogContent-group-title">
        <Typography
          className="MuiDialogContent-title"
          variant="body1"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {title}
        </Typography>
      </Box>
      <DialogActions>
        {showClose && (
          <Button
            variant="outlined"
            sx={{
              width: theme.spacing(16),
            }}
            color="secondary"
            onClick={onClose}
          >
            {closeText ?? t('question:no')}
          </Button>
        )}
        {showConfirm && (
          <Button
            variant="contained"
            type="submit"
            onClick={onClickConfirm}
            sx={{
              ml: `${theme.spacing(4)} !important`,
              width: theme.spacing(16),
            }}
          >
            {confirmText ?? t('question:yes')}
          </Button>
        )}
      </DialogActions>
    </DialogStyled>
  );
});

export interface ModalNotificationRef {
  open(): void;
  hide(): void;
}

export default ModalNotification;
