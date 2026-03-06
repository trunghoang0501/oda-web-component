import { Typography } from '@mui/material';
import { equals } from 'rambda';
import React from 'react';
import { useGetColorByOrderStatus } from '@/hooks/useOrderStatusToColor';
import { IOrderStatus } from '@/types';

interface IOrderStatusCellProps {
  status: IOrderStatus | undefined | null;
  align: 'left' | 'right' | 'center';
}

const OrderStatusCell = ({ status, align }: IOrderStatusCellProps) => {
  const color = useGetColorByOrderStatus(status?.id);

  return (
    <Typography color={color} textAlign={align} fontWeight={600}>
      {status?.name}
    </Typography>
  );
};

export default React.memo(OrderStatusCell, equals);
