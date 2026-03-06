import * as React from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, DialogActions, Typography } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useTheme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { ModalActionProp } from './ModalAction';

const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '&.custom-dialog-action': {
    '& .MuiDialogContent-group-title': {
      '& .MuiDialogContent-title': {
        fontSize: theme.spacing(8.5),
        marginBottom: theme.spacing(8),
      },
      '& .MuiDialogContent-subTitle': {
        fontSize: theme.spacing(4.5),
        fontWeight: 600,
        textAlign: 'left',
      },
    },
  },
  '& .MuiPaper-root': {
    boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
    borderRadius: theme.spacing(4),
  },
  '& .MuiDialogContent-title': {
    lineHeight: 'initial',
    letterSpacing: 'initial',
    fontSize: `${theme.spacing(4.5)}`,
    paddingBottom: 0,
  },
  '& .MuiDialogContent-subTitle': {
    fontSize: theme.spacing(3.5),
    textAlign: 'center',
    fontWeight: 400,
  },
  '& .MuiDialogContent-group-title': {
    padding: theme.spacing(12, 8),
    '& .MuiDialogContent-title': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
      textAlign: 'center',
      marginBottom: theme.spacing(2),
    },
  },
}));

const ModalAction = forwardRef<ModalActionRef, ModalActionProp>(
  function FormDialog(
    {
      title,
      onClickDelete,
      subTitle,
      disableCancel = false,
      disableOk = true,
      disableRemove = false,
      textButtonDelete,
      colorButtonDelete,
      enableIcon = true,
      classCustom = '',
    },
    ref
  ) {
    const theme = useTheme();

    const [t] = useTranslation();

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
      <DialogStyled open={open} onClose={onClose} className={classCustom}>
        {enableIcon && (
          <DialogTitle className="MuiDialogContent-title">
            <WarningAmberRoundedIcon
              sx={{ fontSize: theme.spacing(14) }}
              color="error"
            />
          </DialogTitle>
        )}
        <Box className="MuiDialogContent-group-title">
          <Typography className="MuiDialogContent-title" variant="body1">
            {title}
          </Typography>
          {subTitle && (
            <Typography className="MuiDialogContent-subTitle" variant="body1">
              {subTitle}
            </Typography>
          )}
        </Box>
        <DialogActions sx={{ paddingTop: 0 }}>
          {!disableCancel && (
            <Button variant="outlined" color="secondary" onClick={onClose}>
              {t('cancel')}
            </Button>
          )}
          {!disableRemove && (
            <Button
              variant="contained"
              type="submit"
              color={colorButtonDelete ?? 'error'}
              onClick={onClickDelete}
              sx={{ ml: `${theme.spacing(4)} !important` }}
            >
              {textButtonDelete ?? t('delete')}
            </Button>
          )}
          {!disableOk && (
            <Button variant="outlined" color="secondary" onClick={onClose}>
              {t('ok')}
            </Button>
          )}
        </DialogActions>
      </DialogStyled>
    );
  }
);

export interface ModalActionRef {
  open(): void;

  hide(): void;
}

export default ModalAction;
