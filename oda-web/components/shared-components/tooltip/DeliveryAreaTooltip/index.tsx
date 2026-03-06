import {
  Box,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IDeliveryArea } from '@/types';
import { hexToRGBA } from '@/utils';
import { AreaGroup } from './components/AreaGroup';
import { hasContentToShow } from './utils';

export interface DeliveryAreaTooltipProps {
  deliveryArea: IDeliveryArea[];
  children: JSX.Element;
  tooltipProps?: Pick<TooltipProps, 'sx' | 'PopperProps'>;
}

export const DeliveryAreaTooltip = (props: DeliveryAreaTooltipProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { deliveryArea, children, tooltipProps = {} } = props;

  const isShowContent = useMemo(() => {
    return hasContentToShow(deliveryArea);
  }, [deliveryArea]);

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
        <Box fontWeight={600}>{t('delivery_area')}</Box>

        {isShowContent && (
          <Box>
            {deliveryArea.map((areaItem) => {
              return (
                <AreaGroup key={areaItem.city.id} deliveryArea={areaItem} />
              );
            })}
          </Box>
        )}
      </Box>
    );
  }, [deliveryArea]);

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
