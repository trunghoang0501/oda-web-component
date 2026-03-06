import { Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import { equals } from 'rambda';
import React from 'react';
import { IVendorStatus, VENDOR_STATUS_ID_TO_NAME, VendorIDEnum } from '@/types';

interface IPartnerStatusCellProps {
  status: IVendorStatus;
}

const PartnerStatusCell = ({ status }: IPartnerStatusCellProps) => {
  const theme = useTheme();
  const vendorName =
    VENDOR_STATUS_ID_TO_NAME[status?.id ?? VendorIDEnum.LOCAL].toLowerCase();

  return (
    <Typography
      sx={{ fontWeight: 600 }}
      color={theme?.palette.customColors.vendorStatus[vendorName]}
    >
      {status?.name}
    </Typography>
  );
};

export default React.memo(PartnerStatusCell, equals);
