import * as React from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, DialogActions, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { useTheme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { ModalConfirmBackProps } from './ModalConfirmBackProps';
// Styled Item
const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
    borderRadius: theme.spacing(4),
  },
  '& .MuiDialogContent-title': {
    lineHeight: 'initial',
    letterSpacing: 'initial',
    fontSize: `${theme.spacing(4)} !important`,
  },
  '& .MuiDialogContent-subTitle': {
    fontSize: theme.spacing(3.5),
    textAlign: 'center',
    fontWeight: 400,
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
const ModalConfirmBack = forwardRef<
  ModalConfirmBackPropsRef,
  ModalConfirmBackProps
>(function FormDialog({ title, onClick, subTitle }, ref) {
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
    <DialogStyled open={open} onClose={onClose}>
      <DialogTitle className="MuiDialogContent-title">
        <WarningAmberRoundedIcon
          sx={{ fontSize: theme.spacing(14) }}
          color="error"
        />
      </DialogTitle>
      <Box className="MuiDialogContent-group-title">
        <Typography
          className="MuiDialogContent-title"
          variant="body1"
          sx={{ marginBottom: theme.spacing(2) }}
        >
          {title}
        </Typography>
        {subTitle && (
          <Typography className="MuiDialogContent-subTitle" variant="body1">
            {subTitle}
          </Typography>
        )}
      </Box>
      <DialogActions>
        <Button
          variant="outlined"
          type="submit"
          color="secondary"
          onClick={onClose}
          sx={{ ml: 4 }}
        >
          {t('no')}
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          onClick={onClick}
          sx={{ ml: 4 }}
        >
          {t('yes')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
});

export interface ModalConfirmBackPropsRef {
  open(): void;
  hide(): void;
}

export default ModalConfirmBack;
