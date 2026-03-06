import { Box, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetStoreSettingByIdQuery } from '@/apis';
import Loading from '@/components/shared-components/loading';
import { IDeliverySchedule } from '@/types';
import { convertWeekdayToI18nKey } from '@/utils/store-setting';

export const DeliveryScheduleView = ({
  companyId,
}: {
  companyId?: number | undefined;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: vendorSetting, isLoading } =
    useGetStoreSettingByIdQuery(companyId);
  return (
    <Box
      component="ul"
      sx={{
        pl: 6,
      }}
    >
      {(vendorSetting?.data?.delivery_schedule?.length ?? 0) > 0 &&
        vendorSetting?.data?.delivery_schedule.map(
          (schedule: IDeliverySchedule, index: number) => (
            <Box key={`getScheduleDeliveryView${index}`}>
              {schedule.is_enabled && (
                <Box component="li">
                  <Box display="flex">
                    <Box mr={2}>
                      {t(convertWeekdayToI18nKey(schedule.week_day))}:
                    </Box>
                    <Box display="flex" flexWrap="wrap">
                      {schedule.range.map((range) => (
                        <Box
                          mr={2}
                          sx={{
                            borderRadius: theme.spacing(1.5),
                            px: 2,
                            py: 1,
                            mb: 2,
                            backgroundColor:
                              theme.palette.customColors.tableBorder,
                          }}
                        >
                          {range.from}~{range.to}
                        </Box>
                      ))}
                    </Box>
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
