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
import { mediaMobileMax } from '@/utils/constants';
import { ModalConfirmProps } from './ModalConfirmProps';

// Styled Item
export const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
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
const ModalConfirm = forwardRef<ModalConfirmPropsRef, ModalConfirmProps>(
  function FormDialog(
    { title, onClickConfirm, subTitle, yesText, noText, onCancelConfirm },
    ref
  ) {
    const theme = useTheme();

    const { t } = useTranslation();

    const [open, setOpen] = React.useState(false);

    const onClose = () => {
      if (onCancelConfirm) {
        onCancelConfirm();
        return;
      }
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
      <DialogStyled
        open={open}
        onClose={onClose}
        sx={{
          [mediaMobileMax]: {
            '& .MuiDialogContent-title': {
              fontSize: `${theme.spacing(4)} !important`,
            },
            '& .MuiDialogContent-title > p': {
              fontSize: `${theme.spacing(3.5)} !important`,
            },
            '& .MuiDialogContent-subTitle': {
              fontSize: `${theme.spacing(3.5)} !important`,
            },
            '& button': {
              width: '50%',
            },
          },
        }}
      >
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
            sx={{
              ml: `${theme.spacing(4)} !important`,
              [mediaMobileMax]: {
                width: '100%',
              },
            }}
          >
            {noText ?? t('question:no')}
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="error"
            onClick={onClickConfirm}
            sx={{
              ml: `${theme.spacing(4)} !important`,
              [mediaMobileMax]: {
                width: '100%',
              },
            }}
          >
            {yesText ?? t('question:yes')}
          </Button>
        </DialogActions>
      </DialogStyled>
    );
  }
);

export interface ModalConfirmPropsRef {
  open(): void;
  hide(): void;
}

export default ModalConfirm;
