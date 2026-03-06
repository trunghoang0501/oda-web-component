import { Box, Theme } from '@mui/material';
import { TableCellTypographyStyled } from '@/components/styled-components/table/TableCellTypographyStyled';
import { IVendorCommon, VendorStatusEnum } from '@/types';
import { formatSupplierName } from '@/utils/supplier-info';

interface IVendorNameCellProps {
  vendor: IVendorCommon;
}

const VendorNameCell = (props: IVendorNameCellProps) => {
  const { vendor } = props;

  if (vendor?.is_sync) {
    const vendorName = formatSupplierName(vendor?.remote?.name);
    return (
      <TableCellTypographyStyled
        noWrap
        sx={{
          color: (theme: Theme) => theme.palette.customColors.colorCyan,
        }}
      >
        {vendorName}
      </TableCellTypographyStyled>
    );
  }

  if (vendor?.status?.id === VendorStatusEnum.LOCAL) {
    const vendorName = formatSupplierName(vendor?.name);
    return (
      <TableCellTypographyStyled noWrap>{vendorName}</TableCellTypographyStyled>
    );
  }

  const vendorName = formatSupplierName(vendor?.name);
  const remoteVendorName = formatSupplierName(vendor?.remote?.name);

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <TableCellTypographyStyled noWrap>{vendorName}</TableCellTypographyStyled>
      <TableCellTypographyStyled
        noWrap
        sx={{
          color: (theme) => theme.palette.customColors.colorCyan,
          fontWeight: 400,
        }}
      >
        {remoteVendorName}
      </TableCellTypographyStyled>
    </Box>
  );
};

export default VendorNameCell;
