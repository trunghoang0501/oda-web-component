import { hexToRGBA } from '@/utils';
import { Box, styled } from '@mui/material';

export const BoxPaperContentStyled = styled(Box)(({ theme }) => ({
  '.MuiTab-root': {
    flex: 1,
    fontWeight: 400,
    '&:not(.Mui-selected)': {
      color: theme.palette.text.secondary,
    },
  },
  '.MuiTabs-root': {
    borderBottom: `1px solid ${hexToRGBA(theme.palette.common.black, 0.12)}`,
  },
}));
