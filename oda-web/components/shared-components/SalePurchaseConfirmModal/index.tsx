import { Button, Dialog, DialogProps, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ContentModalStyled,
  SalePurchaseConfirmModalWrapperStyled,
  TitleModalStyled,
} from './styles';

interface ISalePurchaseConfirmModalProps extends DialogProps {
  title: string;
  content: string;
  cancelText?: string;
  confirmText?: string;
  isShowCancel?: boolean;
  isShowConfirm?: boolean;
  className?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const SalePurchaseConfirmModal = (
  props: ISalePurchaseConfirmModalProps
) => {
  const {
    title,
    content,
    cancelText = 'cancel',
    confirmText = 'confirm',
    isShowCancel = true,
    isShowConfirm = true,
    className,
    onConfirm,
    onCancel,
    ...restProps
  } = props;

  const { t } = useTranslation();
  return (
    <Dialog {...restProps} className={className} onClose={onCancel}>
      <SalePurchaseConfirmModalWrapperStyled>
        <TitleModalStyled>{t(title)}</TitleModalStyled>
        <ContentModalStyled>{t(content)}</ContentModalStyled>
        <Stack direction="row" mt={12} gap={4} justifyContent="center">
          {isShowCancel && (
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              {t(cancelText)}
            </Button>
          )}
          {isShowConfirm && (
            <Button variant="contained" onClick={onConfirm}>
              {t(confirmText)}
            </Button>
          )}
        </Stack>
      </SalePurchaseConfirmModalWrapperStyled>
    </Dialog>
  );
};
