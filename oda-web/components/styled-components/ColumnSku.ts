import { styled } from '@mui/material';

export const ColumnSkuStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  '& >p.MuiTypography-root': {
    color: theme?.palette.customColors.tableText,
    wordBreak: 'break-word',
    whiteSpace: 'break-spaces',
  },
  '&:hover': {
    '& .MuiButtonBase-root': {
      visibility: 'visible',
      width: 'auto',
    },
  },
  '& .MuiButtonBase-root': {
    display: 'flex',
    visibility: 'hidden',
    width: 0,
    color: theme?.palette.customColors.tableText,
  },
}));
