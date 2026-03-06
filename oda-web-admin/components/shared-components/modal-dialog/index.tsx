import * as React from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Loading from '@/components/shared-components/loading';
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
    '& .MuiDialogContent-title': {
      padding: theme.spacing(8, 8, 0),
    },
  },
  '&.modal-approvement-rejection': {
    '& .MuiDialogTitle-root': {
      lineHeight: theme.spacing(11.5),
      padding: theme.spacing(8, 8, 12),
    },
    '& .MuiDialogActions-root': {
      paddingTop: theme.spacing(8),
    },
  },
  '&.custom-dialog-big': {
    '& .MuiDialog-paper:not(.MuiDialog-paperFullScreen)': {
      width: `70% !important`,
      maxWidth: `70% !important`,
      overflow: 'hidden',
    },
    '& .MuiDialogContent-root': {
      maxHeight: `calc(100vh - ${theme.spacing(90)})`,
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
    // textTransform: 'capitalize',
    '& .MuiDialogContent-subTitle': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
    },
    '& .MuiDialogContent-desc': {
      fontSize: theme.spacing(3.5),
      marginTop: theme.spacing(2),
    },
  },
  '& .MuiDialogContent-desc': {
    fontSize: theme.spacing(3.5),
  },
  '& .MuiDialogContent-title': {
    fontSize: theme.spacing(8.5),
    fontWeight: 500,
  },
  '&.modal-delete-customer': {
    '.MuiDialogTitle-root': {
      padding: theme.spacing(8, 0, 12),
      lineHeight: theme.spacing(11.5),
    },
    '.MuiDialogContent-group-title ': {
      display: 'none',
    },
    '.MuiDialogContent-root': {
      paddingTop: 0,
      paddingBottom: theme.spacing(12),
    },
  },
  // '& .MuiDialogTitle-root': {
  //   textTransform: 'capitalize',
  // },
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

    return (
      <DialogStyled
        open={open ?? false}
        onClose={onClose}
        className={classCustom}
        sx={{
          backgroundColor: 'transparent',
        }}
        {...rest}
      >
        {(!loading && (
          <>
            <DialogTitle className="MuiDialogContent-title">
              <Stack alignItems="center">
                {icon}
                {title}
              </Stack>
            </DialogTitle>
            <Box className="MuiDialogContent-group-title">
              {!!subTitle && (
                <Typography
                  className="MuiDialogContent-subTitle"
                  variant="body1"
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
