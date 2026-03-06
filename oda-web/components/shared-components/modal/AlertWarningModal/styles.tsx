import { Dialog, DialogProps, styled } from '@mui/material';
import { hexToRGBA } from '@/utils';

export const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: `0px 11px 15px -7px ${hexToRGBA(
      theme.palette.common.black,
      0.2
    )}, 0px 24px 38px 3px ${hexToRGBA(
      theme.palette.common.black,
      0.14
    )}, 0px 9px 46px 8px ${hexToRGBA(theme.palette.common.black, 0.12)}`,
    borderRadius: theme.spacing(4),
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(9.5, 6),
    lineHeight: theme.spacing(11.5),
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
    padding: theme.spacing(4, 8),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    '& .MuiDialogContent-title': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
      textAlign: 'center',
    },
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(8),
    '& .MuiButtonBase-root': {
      textTransform: 'initial',
    },
  },
}));
