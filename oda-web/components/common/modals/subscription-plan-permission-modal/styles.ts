import { Box, Dialog, DialogProps, styled } from '@mui/material';
import { hexToRGBA } from '@/utils';

export const DialogStyled = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
    borderRadius: theme.spacing(4),
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(9, 8, 13.5, 8),
  },
  '& .MuiDialogContent-title': {
    lineHeight: 'initial',
    letterSpacing: 'initial',
    fontSize: `${theme.spacing(8)}`,
  },
  '& .MuiDialogContent-group-title': {
    marginBottom: theme.spacing(12),
    paddingRight: theme.spacing(8),
    paddingLeft: theme.spacing(8),

    '& .MuiDialogContent-title': {
      fontSize: theme.spacing(4.5),
      fontWeight: 600,
      textAlign: 'center',
    },
  },
  '& .MuiDialogActions-root': {
    paddingTop: 0,
  },
}));

export const BoxStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: hexToRGBA(theme.palette.text.secondary, 0.12),
  color: theme.palette.text.primary,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.text.secondary}`,
  marginTop: theme.spacing(4),
}));

export const BoxInfoStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: hexToRGBA(theme.palette.text.secondary, 0.12),
  color: theme.palette.text.primary,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.text.secondary}`,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));
