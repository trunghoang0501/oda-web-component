import { Typography } from '@mui/material';
import { equals } from 'rambda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetColorByApprovalStatus } from '@/hooks/useApprovalStatusToColor';
import { IApprovalStatus } from '@/types';

interface IApprovalStatusCellProps {
  status: IApprovalStatus | undefined | null;
  align: 'left' | 'right' | 'center';
}

const ApprovalStatusCell = ({ status, align }: IApprovalStatusCellProps) => {
  const color = useGetColorByApprovalStatus(status?.id);
  const { t } = useTranslation();

  return (
    <Typography color={color} textAlign={align} fontWeight={600}>
      {t(status?.name || '')}
    </Typography>
  );
};

export default React.memo(ApprovalStatusCell, equals);
