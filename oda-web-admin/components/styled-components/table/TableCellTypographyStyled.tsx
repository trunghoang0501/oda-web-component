import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const TableCellTypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.customColors.tableText,
}));

export const ColumnSkuStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  '& >p.MuiTypography-root': {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: theme?.palette.customColors.tableText,
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
