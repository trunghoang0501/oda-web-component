import React from 'react';
import { Box } from '@mui/material';
import { equals } from 'rambda';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/system';
import { hexToRGBA } from '@/utils';
import { IOrderStatus, OrderStatusEnum } from '@/types';

interface IHistoryOrderStatusProps {
  status: IOrderStatus;
}

const HistoryOrderStatus = ({ status }: IHistoryOrderStatusProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  let color: string = theme.palette.customColors.orderStatusChip.draft;
  let bgColor: string = hexToRGBA(
    theme.palette.customColors.orderStatusChip.draft,
    0.12
  );

  switch (status.id) {
    case OrderStatusEnum.Draft:
      color = theme.palette.customColors.orderStatusChip.draft;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.draft,
        0.12
      );
      break;
    case OrderStatusEnum.Unconfirmed:
      color = theme.palette.customColors.orderStatusChip.unconfirmed;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.unconfirmed,
        0.12
      );
      break;
    case OrderStatusEnum.Confirmed:
      color = theme.palette.customColors.orderStatusChip.confirmed;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.confirmed,
        0.12
      );
      break;
    case OrderStatusEnum.OrderUpdated:
      color = theme.palette.customColors.orderStatusChip.orderUpdated;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.orderUpdated,
        0.12
      );
      break;
    case OrderStatusEnum.ReadyForDelivery:
      color = theme.palette.customColors.orderStatusChip.shipped;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.shipped,
        0.12
      );
      break;
    case OrderStatusEnum.OutForDelivery:
      color = theme.palette.customColors.orderStatusChip.outForDelivery;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.outForDelivery,
        0.12
      );
      break;
    case OrderStatusEnum.Delivered:
      color = theme.palette.customColors.orderStatusChip.delivered;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.delivered,
        0.12
      );
      break;
    case OrderStatusEnum.Completed:
      color = theme.palette.customColors.orderStatusChip.completed;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.completed,
        0.12
      );
      break;
    case OrderStatusEnum.Canceled:
      color = theme.palette.customColors.orderStatusChip.canceled;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.canceled,
        0.12
      );
      break;
    default:
      color = theme.palette.customColors.orderStatusChip.draft;
      bgColor = hexToRGBA(
        theme.palette.customColors.orderStatusChip.draft,
        0.12
      );
      break;
  }

  return (
    <Box
      component="span"
      color={color}
      bgcolor={bgColor}
      p={theme.spacing(0.5, 1)}
      borderRadius={theme.spacing(1.5)}
    >
      {t(status?.name)}
    </Box>
  );
};

export default React.memo(HistoryOrderStatus, equals);
