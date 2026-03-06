import MuiCard, { CardProps } from '@mui/material/Card';
import { styled } from '@mui/material/styles';

// ** Styled Components
export const UnAuthCardStyled = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
  [theme.breakpoints.up('lg')]: { width: '36rem' },
}));
