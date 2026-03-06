import * as React from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { ModalChangePasswordProps } from './ModalChangePassword';

// Styled Item
const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiDialogContent-group-title': {
    marginBottom: theme.spacing(5),
    paddingRight: theme.spacing(8),
    paddingLeft: theme.spacing(8),
    '& .MuiDialogContent-subTitle': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
      lineHeight: theme.spacing(6),
      paddingBottom: theme.spacing((2)),
    },
    '& .MuiDialogContent-desc': {
      fontSize: theme.spacing(3.5),
    },
  },
  '& .MuiDialogContent-desc': {
    fontSize: theme.spacing(3.5),
  },
  '& .MuiDialogContent-header': {
    fontSize: theme.spacing(8),
    fontWeight: 500,
    lineHeight: theme.spacing(11.5),
    padding: theme.spacing(8, 0, 12),
  },
  '& .MuiDialogContent-root': {
    paddingBottom: theme.spacing(12),
  }
}));

const ModalChangePassword = forwardRef<
  ModalChangePasswordRef,
  ModalChangePasswordProps
>(function ModalChangePassword(
  { title, desc, subTitle, onClose: onCloseModal, formComponent },
  ref
) {
  const [open, setOpen] = React.useState(false);

  const onClose = () => {
    setOpen(false);
    onCloseModal?.();
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
      <DialogTitle className="MuiDialogContent-header">{title}</DialogTitle>
      <Box className="MuiDialogContent-group-title">
        <Typography className="MuiDialogContent-subTitle" variant="body1">
          {subTitle}
        </Typography>
        <Typography className="MuiDialogContent-desc" variant="body1">
          {desc}
        </Typography>
      </Box>
      {!!formComponent && formComponent?.()}
    </DialogStyled>
  );
});

export interface ModalChangePasswordRef {
  open(): void;

  hide(): void;
}

export default ModalChangePassword;
