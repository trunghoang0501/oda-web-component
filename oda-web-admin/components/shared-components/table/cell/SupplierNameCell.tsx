import { TableCellTypographyStyled } from '@/components/styled-components/TableCellTypographyStyled';
import { VendorStatusEnum } from '@/types';
import { Box, Theme } from '@mui/material';
import { IOrderSupplier } from 'src/types';

const SupplierNameCell = ({ supplier }: { supplier: IOrderSupplier }) => {
  if (supplier?.status?.id === VendorStatusEnum.LOCAL) {
    return (
      <TableCellTypographyStyled noWrap sx={{ py: 4 }}>
        {supplier?.name}
      </TableCellTypographyStyled>
    );
  }

  if (supplier?.is_sync) {
    return (
      <TableCellTypographyStyled
        noWrap
        sx={{
          color: (theme: Theme) => theme.palette.customColors.colorCyan,
          py: 4,
        }}
      >
        {supplier?.remote?.name}
      </TableCellTypographyStyled>
    );
  }

  return (
    <Box sx={{ overflow: 'hidden', py: 4 }}>
      <TableCellTypographyStyled noWrap>
        {supplier?.name}
      </TableCellTypographyStyled>
      <TableCellTypographyStyled
        noWrap
        sx={{
          color: (theme) => theme.palette.customColors.colorCyan,
          fontWeight: 400,
        }}
      >
        {supplier?.remote?.name}
      </TableCellTypographyStyled>
    </Box>
  );
};

export default SupplierNameCell;
