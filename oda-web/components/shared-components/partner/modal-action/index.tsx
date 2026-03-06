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
import { ModalActionProp } from './ModalAction';

// Styled Item
const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
    borderRadius: theme.spacing(4),
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

const ModalAction = forwardRef<ModalActionRef, ModalActionProp>(
  function FormDialog({ title, onClickConfirm, subTitle }, ref) {
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
        <DialogTitle className="MuiDialogContent-title">{title}</DialogTitle>
        <Box className="MuiDialogContent-group-title">
          <Typography className="MuiDialogContent-title" variant="body1">
            {subTitle}
          </Typography>
        </Box>
        <DialogActions sx={{ paddingTop: 0 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            {t('question:no')}
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            onClick={onClickConfirm}
            sx={{
              ml: `${theme.spacing(4)} !important`,
            }}
          >
            {t('question:yes')}
          </Button>
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
