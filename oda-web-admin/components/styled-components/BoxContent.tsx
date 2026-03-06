import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BoxContentStyled = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow: theme.palette.customColors.boxShadow,
  padding: theme.spacing(8),
}));
