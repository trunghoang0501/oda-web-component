import { Box, Paper, styled } from '@mui/material';
import { hexToRGBA } from '@/utils';
import { mediaMobileMax } from '@/utils/constants';

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

export const PaperStyled = styled(Paper)(({ theme }) => ({
  [mediaMobileMax]: {
    width: '90vw',
    maxWidth: theme.spacing(100),
    marginLeft: '5vw',
  },
}));
