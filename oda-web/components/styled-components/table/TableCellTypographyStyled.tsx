import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { mediaMobileMax } from '@/utils/constants';

export const TableCellTypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.customColors.tableText,
  [mediaMobileMax]: {
    paddingTop: 0,
    paddingBottom: 0,
    whiteSpace: 'break-spaces',
    wordBreak: 'break-all',
  },
}));
