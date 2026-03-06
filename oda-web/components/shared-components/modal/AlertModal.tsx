import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface IAlertModalProps extends DialogProps {
  modalTitle?: ReactNode;
  modalContent?: ReactNode;
  onClickConfirmButton: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
}

export const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
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

/**
 * Design: https://www.figma.com/file/auOrjtXed3LT7ZsD83as5F/Oda-Admin-01?node-id=2417%3A284269&t=TBxTmKoJcPYnsUBP-4
 */
const AlertModal = (props: IAlertModalProps) => {
  const { modalTitle, modalContent, onClickConfirmButton, ...restProps } =
    props;
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
        <DialogContentText component="div" id="alert-dialog-description">
          {modalTitle && (
            <Box className="MuiDialogContent-group-title">
              <Typography className="MuiDialogContent-title" variant="body1">
                {modalTitle}
              </Typography>
            </Box>
          )}

          {modalContent && (
            <Alert
              sx={{
                backgroundColor: 'transparent',
                color: theme.palette.text.primary,
                textAlign: 'left',
              }}
              severity="error"
            >
              {modalContent}
            </Alert>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          color="error"
          onClick={handleClickConfirmButton}
        >
          {t('confirm')}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};

export default AlertModal;
