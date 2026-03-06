import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const TableCellTypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.customColors.tableText,
}));
