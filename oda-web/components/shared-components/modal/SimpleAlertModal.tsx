import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Box,
  Button,
  ButtonProps,
  DialogActions,
  DialogProps,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

export interface ISimpleAlertModalProps extends DialogProps {
  modalTitle?: string;
  confirmButtonColor?: ButtonProps['color'];
  confirmButtonVariant?: ButtonProps['variant'];
  onClickConfirmButton: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
}

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
      marginBottom: 0,
    },
  },
}));

/**
 * Design: https://www.figma.com/file/auOrjtXed3LT7ZsD83as5F/Oda-Admin-01?node-id=2417%3A284269&t=TBxTmKoJcPYnsUBP-4
 */
const SimpleAlertModal = (props: ISimpleAlertModalProps) => {
  const {
    modalTitle,
    confirmButtonColor = 'primary',
    confirmButtonVariant = 'contained',
    onClickConfirmButton,
    ...restProps
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  const handleClickConfirmButton = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (typeof onClickConfirmButton === 'function') {
      onClickConfirmButton(e);
    }
  };

  return (
    <DialogStyled {...restProps}>
      <DialogTitle className="MuiDialogContent-title">
        <WarningAmberRoundedIcon
          sx={{ fontSize: theme.spacing(14) }}
          color="error"
        />
      </DialogTitle>
      <Box
        className="MuiDialogContent-group-title"
        sx={{ textAlign: 'center' }}
      >
        <Typography className="MuiDialogContent-title" variant="body1">
          {modalTitle}
        </Typography>
      </Box>
      <DialogActions sx={{ paddingTop: 0 }}>
        <Button
          variant={confirmButtonVariant}
          color={confirmButtonColor}
          onClick={handleClickConfirmButton}
        >
          {t('ok')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};

export default SimpleAlertModal;
