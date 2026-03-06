import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { equals } from 'rambda';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { ICustomer } from '@/types';
import { useGetColorByCustomerStatus } from '@/hooks/useCustomerStatusToColor';

const CustomerStatusCell = ({
  row,
}: GridRenderCellParams<ICustomer, ICustomer>) => {
  const status = useMemo(() => {
    return row.status;
  }, [row.status]);

  const color = useGetColorByCustomerStatus(row.status?.id);

  return (
    <Typography color={color} fontWeight={600}>
      {status?.name}
    </Typography>
  );
};

export default React.memo(CustomerStatusCell, equals);
