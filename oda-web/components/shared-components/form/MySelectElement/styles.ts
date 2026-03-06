import { MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { hexToRGBA } from '@/utils';

export const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  lineHeight: theme.spacing(5),
  fontSize: theme.spacing(3.5),
  '&:hover': {
    backgroundColor: hexToRGBA(theme.palette.customColors.magnolia, 0.8),
  },
}));
