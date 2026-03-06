import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { equals } from 'rambda';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { ICompany } from '@/types';
import { useGetColorByCompanyStatus } from '@/hooks/useCompanyStatusToColor';

const CompanyStatusCell = ({
  row,
}: GridRenderCellParams<ICompany, ICompany>) => {
  const status = useMemo(() => {
    return row.status;
  }, [row.status]);

  const color = useGetColorByCompanyStatus(row.status?.id);

  return (
    <Typography color={color} fontWeight={600}>
      {status?.name}
    </Typography>
  );
};

export default React.memo(CompanyStatusCell, equals);
