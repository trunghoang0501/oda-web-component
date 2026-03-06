import { Box } from '@mui/material';
import React from 'react';
import { useGetStoreSettingByIdQuery } from '@/apis';
import { DistrictNameView } from '@/components/shared-components/delivery-view/DistrictNameView';
import Loading from '@/components/shared-components/loading';
import { IDeliveryArea } from '@/types';

export const DeliveryAreaView = ({
  companyId,
}: {
  companyId?: number | undefined;
}) => {
  const { data: vendorSetting, isLoading } =
    useGetStoreSettingByIdQuery(companyId);
  return (
    <Box
      component="ul"
      sx={{
        pl: 6,
      }}
    >
      {(vendorSetting?.data?.delivery_area?.length ?? 0) > 0 &&
        vendorSetting!.data!.delivery_area.map(
          (area: IDeliveryArea, index: number) => (
            <Box key={`getScheduleDeliveryView${index}`}>
              {area.is_enabled && (
                <Box component="li">
                  <Box display="flex">
                    {area.city.name}:{' '}
                    {area.district_ids.map((districtId, index2) => (
                      <DistrictNameView
                        id={districtId}
                        withComma={index2 < area.district_ids.length - 1}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )
        )}
      {isLoading && <Loading />}
    </Box>
  );
};
