import { Box, SxProps, Theme } from '@mui/material';
import React from 'react';
import { TableCellTypographyStyled } from '@/components/styled-components/table/TableCellTypographyStyled';
import { IVendorCommon, VendorStatusEnum } from '@/types';
import { mediaMobileMax } from '@/utils/constants';
import { formatSupplierName } from '@/utils/supplier-info';

const SupplierNameCell = ({
  supplier,
  sx,
}: {
  supplier: IVendorCommon;
  sx?: SxProps<Theme>;
}) => {
  if (supplier?.is_sync) {
    const supplierName = formatSupplierName(supplier?.remote?.name);
    return (
      <TableCellTypographyStyled
        title={supplierName}
        sx={{
          color: (theme: Theme) => theme.palette.customColors.colorCyan,
          py: 4,
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: 1.2,
        }}
      >
        {supplierName}
      </TableCellTypographyStyled>
    );
  }

  if (supplier?.status?.id === VendorStatusEnum.LOCAL) {
    const supplierName = formatSupplierName(supplier?.name);
    return (
      <TableCellTypographyStyled
        title={supplierName}
        sx={{
          py: 4,
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: 1.2,
        }}
      >
        {supplierName}
      </TableCellTypographyStyled>
    );
  }

  const supplierName = formatSupplierName(supplier?.name);
  const remoteSupplierName = formatSupplierName(supplier?.remote?.name);

  return (
    <Box
      sx={{
        overflow: 'hidden',
        py: 4,
        [mediaMobileMax]: {
          py: 0,
        },
        ...sx,
      }}
    >
      <TableCellTypographyStyled
        className="supplierName"
        title={supplierName}
        sx={{
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: 1.2,
        }}
      >
        {supplierName}
      </TableCellTypographyStyled>
      <TableCellTypographyStyled
        className="supplierName"
        title={remoteSupplierName}
        sx={{
          color: (theme) => theme.palette.customColors.colorCyan,
          fontWeight: 400,
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: 1.2,
        }}
      >
        {remoteSupplierName}
      </TableCellTypographyStyled>
    </Box>
  );
};

export default SupplierNameCell;
