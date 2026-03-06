import { Typography, styled } from '@mui/material';
import { mediaMobileMax } from '@/utils/constants';

export const ModalTitleStyled = styled(Typography)(({ theme }) => ({
  fontSize: theme.spacing(8.5),
  fontWeight: 500,
  textAlign: 'center',
  [mediaMobileMax]: {
    fontSize: theme.spacing(4.5),
  },
}));
