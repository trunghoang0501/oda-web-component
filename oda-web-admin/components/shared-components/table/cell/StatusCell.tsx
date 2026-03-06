import React from 'react';
import { Typography } from '@mui/material';
import { equals } from 'rambda';
import { IStatus } from '@/types';
import { useGetColorByStatus } from '@/hooks/useStatusToColor';

const StatusCell = ({ status }: { status: IStatus }) => {
  const color = useGetColorByStatus(status.id);

  return (
    <Typography color={color} fontWeight={600}>
      {status.name}
    </Typography>
  );
};

export default React.memo(StatusCell, equals);
