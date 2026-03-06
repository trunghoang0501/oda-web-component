import { Box, BoxProps, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BoxContentStyled = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  marginTop: theme.spacing(6),
  boxShadow: theme.palette.customColors.boxShadow,
  padding: theme.spacing(8),
  '&.no-title': {
    paddingTop: 0,
  },

  '& .MuiCardContent-root': {
    marginTop: theme.spacing(4),
    padding: 0,
  },
}));

export const BoxContentTitleStyled = styled(Box)<BoxProps>(({ theme }) => ({
  paddingBottom: theme.spacing(6),
  '& .MuiTypography-root': {
    fontWeight: 500,
    fontSize: theme.spacing(7),
    lineHeight: theme.spacing(9.5),
  },
}));

export const BoxContentDividerStyled = styled(Divider)(({ theme }) => ({
  borderBottom: theme.palette.customColors.tableBorderBottom,
  margin: 0,
}));
