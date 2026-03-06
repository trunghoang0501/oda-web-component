import { Box, Stack, Typography, useTheme } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import Loading from '@/components/shared-components/loading';
import { mediaMobileMax } from '@/utils/constants';
import { ModalDialogProps } from './ModalDialog';

// Styled Item
const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  // Custom Modal small and scroll content
  '&.custom-dialog': {
    '& .MuiDialog-paper:not(.MuiDialog-paperFullScreen)': {
      width: `${theme.spacing(126.5)} !important`,
      maxWidth: `${theme.spacing(126.5)} !important`,
      overflow: 'hidden',
    },
    '& .MuiDialogContent-root': {
      maxHeight: `calc(100vh - ${theme.spacing(66.5)})`,
      overflow: 'auto',
      paddingBottom: 0,
    },
    '& .MuiDialogActions-root': {
      paddingTop: theme.spacing(4),
    },
  },
  '&.custom-dialog-big': {
    '& .MuiDialog-paper:not(.MuiDialog-paperFullScreen)': {
      width: `${theme.spacing(201.5)} !important`,
      maxWidth: `${theme.spacing(201.5)} !important`,
      overflow: 'hidden',
    },
    '& .MuiDialogContent-root': {
      maxHeight: `calc(100vh - ${theme.spacing(66.5)})`,
      overflow: 'auto',
      paddingTop: 0,
    },
    '& .MuiDialogActions-root': {
      paddingTop: theme.spacing(4),
    },
    '& .MuiDialogContent-group-title': {
      display: 'none',
    },
  },
  '&.custom-dialog-subscription': {
    '& .MuiDialog-paper:not(.MuiDialog-paperFullScreen)': {
      width: `${theme.spacing(266)} !important`,
      maxWidth: `${theme.spacing(266)} !important`,
      overflow: 'hidden',
    },
    '& .MuiDialogContent-title': {
      fontWeight: 500,
      lineHeight: theme.spacing(11.5),
      padding: theme.spacing(8),
    },
    '& .MuiDialogContent-group-title': {
      display: 'none',
    },
    '& .MuiDialogContent-root': {
      overflow: 'hidden',
      paddingTop: 0,
      paddingBottom: 0,
    },
    '& .subscriptionScroll': {
      maxHeight: `calc(50vh - ${theme.spacing(44)})`,
      overflow: 'auto',
      paddingTop: 0,
    },
    '& .MuiDialogActions-root': {
      paddingTop: theme.spacing(8),
      '& .MuiButton-containedPrimary': {
        minWidth: theme.spacing(25),
      },
    },
  },
  '&.custom-dialog-result-delele-account': {
    '& .MuiDialogContent-group-title': {
      display: 'none',
    },
    '& .MuiDialogTitle-root': {
      display: 'none',
    },
  },
  '& .MuiDialogContent-group-title': {
    marginBottom: theme.spacing(3),
    paddingRight: theme.spacing(8),
    paddingLeft: theme.spacing(8),
    '& .MuiDialogContent-subTitle': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
    },
    '& .MuiDialogContent-desc': {
      fontSize: theme.spacing(3.5),
    },
  },
  '& .MuiDialogContent-desc': {
    fontSize: theme.spacing(3.5),
  },
  '& .MuiDialogContent-title': {
    fontSize: theme.spacing(8),
    fontWeight: 600,
  },
}));

const FormDialog = forwardRef<FormDialogRef, ModalDialogProps>(
  function FormDialog(
    {
      icon,
      title,
      desc,
      subTitle,
      formComponent,
      onClose: onCloseModal,
      onOpenModal,
      loading,
      classCustom = '',
      subTitleProps,
      ...rest
    },
    ref
  ) {
    const [open, setOpen] = React.useState<boolean>();

    useEffect(() => {
      if (open === false && typeof onCloseModal === 'function') {
        onCloseModal?.();
      }
    }, [open]);

    const onClose = useCallback(() => {
      setOpen(false);
    }, []);

    const onOpen = () => {
      if (onOpenModal && !open) {
        onOpenModal();
      }
      setOpen(true);
    };

    useImperativeHandle(
      ref,
      () => ({
        hide: onClose,
        open: onOpen,
      }),
      []
    );
    const theme = useTheme();
    return (
      <DialogStyled
        open={open ?? false}
        onClose={onClose}
        className={classCustom}
        sx={{
          backgroundColor: 'transparent',
          [mediaMobileMax]: {
            '& .MuiDialogActions-root button': {
              width: '100%',
            },
          },
        }}
        {...rest}
      >
        {(!loading && (
          <>
            <DialogTitle
              className="MuiDialogContent-title"
              sx={{
                [mediaMobileMax]: {
                  fontSize: `${theme.spacing(5)}!important`,
                  p: 4,
                },
              }}
            >
              <Stack alignItems="center">
                {icon}
                {title}
              </Stack>
            </DialogTitle>
            <Box
              className="MuiDialogContent-group-title"
              sx={{
                [mediaMobileMax]: {
                  '& *': {
                    fontSize: theme.spacing(3.5),
                  },
                },
              }}
            >
              {!!subTitle && (
                <Typography
                  className="MuiDialogContent-subTitle"
                  variant="body1"
                  sx={{
                    [mediaMobileMax]: {
                      fontSize: theme.spacing(3.5),
                    },
                  }}
                  {...subTitleProps}
                >
                  {subTitle}
                </Typography>
              )}
              {!!desc && (
                <Typography className="MuiDialogContent-desc" variant="body1">
                  {desc}
                </Typography>
              )}
            </Box>
            {formComponent?.()}
          </>
        )) || <Loading backdropColor="transparent" />}
      </DialogStyled>
    );
  }
);

export interface FormDialogRef {
  open(): void;

  hide(): void;
}

export default FormDialog;
