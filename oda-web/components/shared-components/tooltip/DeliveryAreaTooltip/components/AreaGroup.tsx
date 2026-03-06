import { Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { useGetListDistrictsQuery } from '@/apis';
import { IDeliveryArea, IDistrict } from '@/types';

interface IAreaGroupProps {
  deliveryArea: IDeliveryArea;
}

export const AreaGroup = (props: IAreaGroupProps) => {
  const theme = useTheme();
  const { deliveryArea } = props;
  const { data: resp } = useGetListDistrictsQuery(deliveryArea.city.id, {
    refetchOnMountOrArgChange: false,
  });
  const districtList = useMemo(() => {
    if (!resp?.data) return [];

    const tmpDistrictList: string[] = [];
    const data = resp.data as IDistrict[];

    deliveryArea.district_ids.forEach((districtId) => {
      const foundedItem = data.find((districtItem) => {
        return districtItem.id === districtId;
      });

      if (foundedItem) {
        tmpDistrictList.push(foundedItem.name!);
      }
    });

    return tmpDistrictList;
  }, [resp?.data]);

  return (
    <Box
      sx={{
        display: 'flex',
        mt: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          mt: 2.25,
          mx: 2,
          height: theme.spacing(0.75),
          width: theme.spacing(0.75),
          borderRadius: theme.spacing(10),
          background: theme.palette.text.primary,
        }}
      />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Box>{deliveryArea.city.name}:</Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(2,1fr)`,
            rowGap: 1,
            columnGap: 2,
            mt: 1,
          }}
        >
          {districtList.map((item, idx) => {
            return <Box key={idx}>{item}</Box>;
          })}
        </Box>
      </Box>
    </Box>
  );
};
