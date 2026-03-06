import React from 'react';
import { Box } from '@mui/material';
import { equals } from 'rambda';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/system';
import { hexToRGBA } from '@/utils';

export enum HistoryProducStatusEnum {
  Added = 'add',
  Updated = 'update',
  Removed = 'delete',
}

interface IHistoryProductStatusProps {
  status: HistoryProducStatusEnum;
}

const HistoryProductStatus = ({ status }: IHistoryProductStatusProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  let color: string = theme.palette.primary.light;
  let bgColor: string = hexToRGBA(theme.palette.primary.light, 0.12);
  let text: string = t('added');

  switch (status) {
    case HistoryProducStatusEnum.Updated:
      color = theme.palette.customColors.colorCyan;
      bgColor = hexToRGBA(theme.palette.customColors.colorCyan, 0.12);
      text = t('updated');
      break;
    case HistoryProducStatusEnum.Removed:
      color = theme.palette.error.light;
      bgColor = hexToRGBA(theme.palette.error.light, 0.12);
      text = t('removed');
      break;
    case HistoryProducStatusEnum.Added:
    default:
      color = theme.palette.primary.light;
      bgColor = hexToRGBA(theme.palette.primary.light, 0.12);
      text = t('added');
      break;
  }

  return (
    <Box
      component="span"
      color={color}
      bgcolor={bgColor}
      p={theme.spacing(0.5, 1)}
    >
      {text}
    </Box>
  );
};

export default React.memo(HistoryProductStatus, equals);
