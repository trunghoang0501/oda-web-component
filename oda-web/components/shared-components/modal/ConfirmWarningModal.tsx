import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogProps,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import RedTheme from '@/theme/RedTheme';

export interface IConfirmWarningModalProps extends DialogProps {
  modalTitle?: ReactNode;
  modalContent?: ReactNode;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  onClickCancelButton?: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  onClickConfirmButton?: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  confirmButtonColor?: ButtonProps['color'];
  showIcon?: boolean;
  confirmButtonVariant?: ButtonProps['variant'];
  isRedTheme?: boolean;
}

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

/**
 * Design: https://www.figma.com/file/auOrjtXed3LT7ZsD83as5F/Oda-Admin-01?node-id=1192%3A49471&t=TBxTmKoJcPYnsUBP-4
 */
const ConfirmWarningModal = (props: IConfirmWarningModalProps) => {
  const { t } = useTranslation();
  const {
    modalTitle,
    modalContent,
    showCancelButton = true,
    showConfirmButton = true,
    cancelButtonLabel = t('cancel'),
    confirmButtonLabel = t('confirm'),
    confirmButtonColor = 'error',
    confirmButtonVariant = 'contained',
    onClickCancelButton,
    onClickConfirmButton,
    showIcon = true,
    isRedTheme = false,
    onClose,
    ...restProps
  } = props;
  const theme = useTheme();

  const handleClickCancelButton = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (typeof onClickCancelButton === 'function') {
      onClickCancelButton(e);
    }
    // Close the modal when cancel is clicked
    if (typeof onClose === 'function') {
      onClose(e, 'escapeKeyDown');
    }
  };

  const handleClickConfirmButton = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (typeof onClickConfirmButton === 'function') {
      onClickConfirmButton(e);
    }
  };

  return (
    <DialogStyled {...restProps}>
      {showIcon && (
        <DialogTitle className="MuiDialogContent-title">
          <WarningAmberRoundedIcon
            sx={{ fontSize: theme.spacing(14) }}
            color="error"
          />
        </DialogTitle>
      )}

      <Box className="MuiDialogContent-group-title">
        {modalTitle && (
          <Typography
            className="MuiDialogContent-title"
            variant="body1"
            sx={{ mb: 2 }}
          >
            {modalTitle}
          </Typography>
        )}

        {modalContent && (
          <Typography
            className="MuiDialogContent-subTitle"
            variant="body1"
            sx={{ fontWeight: modalTitle ? '400' : '600' }}
          >
            {modalContent}
          </Typography>
        )}
      </Box>

      {(showCancelButton || showConfirmButton) && (
        <DialogActions
          sx={{
            gap: theme.spacing(4),
            '& .MuiButton-root:not(:first-of-type)': {
              ml: 0,
            },
          }}
        >
          {showCancelButton && (
            <Button
              variant="outlined"
              type="button"
              color="secondary"
              onClick={handleClickCancelButton}
            >
              {cancelButtonLabel}
            </Button>
          )}

          {showConfirmButton && !isRedTheme && (
            <Button
              variant={confirmButtonVariant}
              type="submit"
              color={confirmButtonColor}
              onClick={handleClickConfirmButton}
            >
              {confirmButtonLabel}
            </Button>
          )}
          {showConfirmButton && isRedTheme && (
            <RedTheme>
              <Button
                className="redThemeButton"
                variant={confirmButtonVariant}
                type="submit"
                color={confirmButtonColor}
                onClick={handleClickConfirmButton}
              >
                {confirmButtonLabel}
              </Button>
            </RedTheme>
          )}
        </DialogActions>
      )}
    </DialogStyled>
  );
};

export default ConfirmWarningModal;
