import {
  Box,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IDeliverySchedule } from '@/types';
import { hexToRGBA } from '@/utils';
import { convertWeekdayToI18nKey } from '@/utils/store-setting';
import { hasContentToShow } from './utils';

export interface IDeliveryScheduleTooltipProps {
  deliverySchedule: IDeliverySchedule[];
  children: JSX.Element;
  tooltipProps?: Pick<TooltipProps, 'sx' | 'PopperProps'>;
}

export const DeliveryScheduleTooltip = (
  props: IDeliveryScheduleTooltipProps
) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { deliverySchedule, children, tooltipProps = {} } = props;

  const isShowContent = useMemo(() => {
    return hasContentToShow(deliverySchedule);
  }, [deliverySchedule]);

  const TitleComponent = useCallback(() => {
    return (
      <Box
        sx={{
          p: 2,
          fontSize: theme.spacing(3.5),
          lineHeight: theme.spacing(5),
          fontWeight: 400,
        }}
      >
        <Box fontWeight={600}>{t('delivery_schedule')}</Box>

        {isShowContent && (
          <Box>
            {deliverySchedule.map((scheduleGroup) => {
              return (
                <Box
                  key={scheduleGroup.week_day}
                  sx={{
                    display: 'flex',
                    mt: 2,
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
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      {t(convertWeekdayToI18nKey(scheduleGroup.week_day))}:
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                      }}
                    >
                      {scheduleGroup.range.map((rangeItem) => {
                        return (
                          <Box
                            key={`${rangeItem.from}-${rangeItem.to}`}
                            sx={{
                              ml: 2,
                              whiteSpace: 'nowrap',
                              background:
                                theme.palette.customColors.tableBorder,
                              borderRadius: theme.spacing(0.5),
                              px: 0.5,
                            }}
                          >
                            {rangeItem.from} ~ {rangeItem.to}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    );
  }, [deliverySchedule]);

  return (
    <Tooltip
      {...tooltipProps}
      placement="top"
      arrow
      PopperProps={{
        ...tooltipProps.PopperProps,
        sx: {
          [`& .${tooltipClasses.tooltip}`]: {
            minWidth: theme.spacing(106),
            color: theme.palette.text.primary,
            background: theme.palette.common.white,
            boxShadow: `0px 1px 4px ${hexToRGBA(
              theme.palette.common.black,
              0.1
            )}`,
            p: 0,
          },
          [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.common.white,
            '&::before': {
              background: theme.palette.common.white,
              border: `1px solid ${theme.palette.divider}`,
            },
          },
          ...tooltipProps.PopperProps?.sx,
        },
      }}
      title={<TitleComponent />}
    >
      {children}
    </Tooltip>
  );
};

export { hasContentToShow } from './utils';
