import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ButtonExpandStyled = styled(Button)(({ theme }) => ({
  marginLeft: 'auto',
  width: theme.spacing(10),
  minWidth: theme.spacing(10),
}));
