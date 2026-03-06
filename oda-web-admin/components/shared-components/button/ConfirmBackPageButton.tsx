import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTheme } from '@mui/system';
import deepmerge from 'deepmerge';
import { useRouter } from 'next/router';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyModal } from '@/hooks/useMyModal';

interface IConfirmBackPageButtonProps {
  buttonLabel?: string;
  needConfirmWithModal?: boolean; // `true`: open modal when click back
  modalTitle?: string;
  modalContent?: string;
  onSubmitBack?: () => void;
  sx?: ButtonProps['sx'];
}

/**
 * Use to show back button on top of page.
 * Set `needConfirmWithModal={true}` If you need show confirm modal before back page
 */
const ConfirmBackPageButton = (props: IConfirmBackPageButtonProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const {
    buttonLabel = t('back'),
    needConfirmWithModal = false,
    modalTitle = t('dialog:for_your_awareness') as string,
    modalContent = t(
      'dialog:are_you_sure_to_cancel_this_process_then_backing_to_previous_page'
    ) as string,
    onSubmitBack,
    sx = {},
  } = props;
  const myModal = useMyModal();

  const onConfimActionBack = () => {
    if (typeof onSubmitBack === 'function') {
      onSubmitBack();
    } else {
      router.back();
    }
  };

  const onClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    if (needConfirmWithModal) {
      const instanceModal = myModal.confirmWarning({
        modalTitle,
        modalContent,
        cancelButtonLabel: t('no'),
        confirmButtonLabel: t('yes'),
        onClickCancelButton() {
          instanceModal.hide();
        },
        onClickConfirmButton() {
          instanceModal.hide();
          onConfimActionBack();
        },
      });
    } else {
      onConfimActionBack();
    }
  };

  return (
    <Button
      startIcon={<ArrowBackIosNewIcon />}
      sx={deepmerge.all<IConfirmBackPageButtonProps['sx']>([
        {
          p: 0,
          color: theme.palette.text.primary,
          textTransform: 'none',
          fontSize: theme.spacing(4),
          lineHeight: theme.spacing(6),
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '.MuiSvgIcon-root': {
            fontSize: theme.spacing(6),
          },
        },
        sx,
      ])}
      onClick={onClick}
    >
      {buttonLabel}
    </Button>
  );
};

export default ConfirmBackPageButton;
