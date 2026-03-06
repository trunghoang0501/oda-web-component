import {
  Box,
  Button,
  DialogActions,
  DialogProps,
  Typography,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogStyled } from './styles';

export interface IAlertWarningModalProps extends DialogProps {
  modalTitle: ReactNode;
  modalContent?: ReactNode;
  onClickConfirmButton: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  confirmButtonLabel?: string;
}

/**
 * Design: https://www.figma.com/file/0v0kRlUdgTTT5T00n7kQdz/oda-V1-Desktop-Design-Phase-2?node-id=3012-874063&t=imcuKSpXoqVcK9bz-4
 */
const AlertWarningModal = (props: IAlertWarningModalProps) => {
  const { t } = useTranslation();
  const {
    modalTitle,
    modalContent,
    confirmButtonLabel = t('dialog:got_it'),
    onClickConfirmButton,
    ...restProps
  } = props;

  const handleClickConfirmButton = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (typeof onClickConfirmButton === 'function') {
      onClickConfirmButton(e);
    }
  };

  return (
    <DialogStyled {...restProps}>
      <DialogTitle>{t('dialog:warning')}</DialogTitle>

      <Box className="MuiDialogContent-group-title">
        <Typography className="MuiDialogContent-title" variant="body1">
          {modalTitle}
        </Typography>

        {modalContent && (
          <Typography className="MuiDialogContent-subTitle" variant="body1">
            {modalContent}
          </Typography>
        )}
      </Box>

      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          onClick={handleClickConfirmButton}
        >
          {confirmButtonLabel}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};

export default AlertWarningModal;
