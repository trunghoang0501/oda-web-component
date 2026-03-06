import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
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
import { ModalConfirmProp } from './ModalConfirm';

// Styled Item
const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
    borderRadius: theme.spacing(4),
  },
  '& .MuiDialogTitle-root': {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(12),
  },
  '& .MuiDialogContent-title': {
    lineHeight: 'initial',
    letterSpacing: 'initial',
    fontSize: `${theme.spacing(4.5)}`,
  },
  '& .MuiDialogContent-subTitle': {
    fontSize: theme.spacing(3.5),
    textAlign: 'center',
    fontWeight: 400,
  },
  '& .MuiDialogContent-group-title': {
    marginBottom: theme.spacing(12),
    paddingRight: theme.spacing(8),
    paddingLeft: theme.spacing(8),
    '& .MuiDialogContent-title': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
      textAlign: 'center',
      marginBottom: theme.spacing(2),
    },
  },
}));

const ModalConfirm = forwardRef<ModalConfirmRef, ModalConfirmProp>(
  function FormDialog(
    {
      title,
      subTitle,
      onConfirm,
      disableCancel = false,
      disableOk = true,
      disableConfirm = false,
      cancelButtonText,
      confirmButtonText,
      okButtonText,
      confirmButtonColor = 'error',
    },
    ref
  ) {
    const theme = useTheme();

    const { t } = useTranslation();

    const [open, setOpen] = React.useState(false);

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
        <DialogTitle className="MuiDialogContent-title">
          <WarningAmberRoundedIcon
            sx={{ fontSize: theme.spacing(20) }}
            color="error"
          />
        </DialogTitle>
        <Box className="MuiDialogContent-group-title">
          <Typography className="MuiDialogContent-title" variant="body1">
            {title}
          </Typography>
          {subTitle && subTitle?.()}
        </Box>
        <DialogActions sx={{ paddingTop: 0 }}>
          {!disableCancel && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{
                height: theme.spacing(10),
                color: theme.palette.text.primary,
                borderColor: theme.palette.text.primary,
              }}
            >
              {cancelButtonText || t('cancel')}
            </Button>
          )}
          {!disableConfirm && (
            <Button
              variant="contained"
              type="submit"
              color={confirmButtonColor}
              onClick={onConfirm}
              sx={{
                ml: `${theme.spacing(4)} !important`,
                height: theme.spacing(10),
              }}
            >
              {confirmButtonText || t('delete')}
            </Button>
          )}
          {!disableOk && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{ height: theme.spacing(10) }}
            >
              {okButtonText || t('ok')}
            </Button>
          )}
        </DialogActions>
      </DialogStyled>
    );
  }
);

export interface ModalConfirmRef {
  open(): void;

  hide(): void;
}

export default ModalConfirm;
