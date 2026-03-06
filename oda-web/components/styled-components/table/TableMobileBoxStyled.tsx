import { Box, Table, TableBody } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TableBoxInfoStyled = styled(Box)(({ theme }) => ({
  color: `${theme.palette.text.primary} !important`,
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start !important',
  width: '100%',
  padding: `0 ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(4)}`,
}));

export const TableInfoItemViewStyled = styled(Table)(({ theme }) => ({
  '& td': {
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
      1
    )} ${theme.spacing(4)} !important`,
    borderBottom: 0,
  },

  '& td p, & td .MuiChip-label': {
    fontSize: theme.spacing(3.5),
  },
  '& td:last-of-type': {
    color: theme.palette.text.primary,
    fontWeight: '500',
  },
}));
export const TableInCollapseItemViewStyled = styled(Table)(({ theme }) => ({
  '& td': {
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
      1
    )} ${theme.spacing(4)} !important`,
    borderBottom: 0,
  },

  '& td p, & td .MuiChip-label': {
    fontSize: theme.spacing(3.5),
  },
  '& td:last-of-type': {
    color: theme.palette.text.primary,
    fontWeight: '500',
  },
}));
export const TableBodyInCollapseItemViewStyled = styled(TableBody)(() => ({
  '& td > div > div': {
    width: '100%',
  },
  '& td .MuiInput-input': {
    textAlign: 'left !important',
  },
}));

export const TableAddSupplierProductStyled = styled(Table)(({ theme }) => ({
  '& td': {
    borderBottom: 0,
  },
  '& td p, & td .MuiChip-label': {
    fontSize: theme.spacing(3.5),
  },
  '& td:first-of-type': {
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
      1
    )} 0 !important`,
  },
  '& td:last-of-type': {
    padding: `0 0 0 ${theme.spacing(2)} !important`,
    color: theme.palette.text.primary,
    fontWeight: '500',
  },
}));
