import React from 'react';
import { useGetDistrictQuery } from '@/apis';

export const DistrictNameView = ({
  id,
  withComma = false,
}: {
  id: number;
  withComma: boolean;
}) => {
  const { data: district, isLoading } = useGetDistrictQuery(id);
  return (
    <>
      {isLoading ? '...' : district?.data?.name ?? ''}
      {!isLoading && withComma ? ', ' : ''}
    </>
  );
};
