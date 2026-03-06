import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, useTheme } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import deepmerge from 'deepmerge';
import { useRouter } from 'next/router';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyModal } from '@/hooks/useMyModal';
import { mediaMobileMax } from '@/utils/constants';

interface IConfirmBackPageButtonProps {
  buttonLabel?: string;
  needConfirmWithModal?: boolean; // `true`: open modal when click back
  modalTitle?: string;
  modalContent?: string;
  onSubmitBack?: () => void;
  sx?: ButtonProps['sx'];
  mobileTop?: string;
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
    mobileTop,
  } = props;
  const myModal = useMyModal();

  const onConfirmActionBack = () => {
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
        cancelButtonLabel: t('question:no'),
        confirmButtonLabel: t('question:yes'),
        onClickCancelButton() {
          instanceModal.hide();
        },
        onClickConfirmButton() {
          instanceModal.hide();
          onConfirmActionBack();
        },
      });
    } else {
      onConfirmActionBack();
    }
  };

  return (
    <Box
      className="mobileNavTitle"
      sx={{
        [mediaMobileMax]: {
          display: 'block',
          position: 'absolute',
          top: mobileTop ?? theme.spacing(4.75),
          left: theme.spacing(4),
          backgroundColor: 'white',
          fontSize: theme.spacing(3.5),
        },
      }}
    >
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
    </Box>
  );
};

export default ConfirmBackPageButton;
