import { Box, Grid, TableCell, TableRow, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TableCellWidth25TypographyStyled } from '@/components/styled-components/table/TableCellWidth3325TypographyStyled';
import {
  TableAddSupplierProductStyled,
  TableBodyInCollapseItemViewStyled,
} from '@/components/styled-components/table/TableMobileBoxStyled';
import { NUMBER_DECIMAL_SCALE_MAX } from '@/constants';
import { translate } from '@/i18n/translate';
import { ISaleOrderProductItem } from '@/types/sale-order';
import { DEFAULT_CURRENCY_UNIT, formatNumberKeepDecimal } from '@/utils';
import { formatMoney, formatPrice, formatVat } from '@/utils/monetary-mask';

export const MobileAddProductItemView = ({
  item,
  isFirst,
  isLast,
  productMap,
}: {
  item: ISaleOrderProductItem;
  isFirst?: boolean;
  isLast?: boolean;
  productMap: any;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const rowData = (label: string, value: string) => {
    return (
      <TableRow>
        <TableCellWidth25TypographyStyled>
          {t(label)}
        </TableCellWidth25TypographyStyled>
        <TableCell>{value}</TableCell>
      </TableRow>
    );
  };
  return (
    <Grid
      container
      sx={{
        border: `1px solid ${theme.palette.customColors.tableBorder}`,
        borderTopLeftRadius: isFirst ? theme.spacing(2) : 0,
        borderTopRightRadius: isFirst ? theme.spacing(2) : 0,
        borderBottomLeftRadius: isLast ? theme.spacing(2) : 0,
        borderBottomRightRadius: isLast ? theme.spacing(2) : 0,
        p: 4,
        pt: 1,
        pr: 1,
      }}
    >
      <Box
        sx={{
          color: `${theme.palette.text.primary} !important`,
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start !important',
          width: '100%',
          padding: '0',
        }}
      >
        <Box display="flex" justifyContent="start" alignItems="center">
          <Box
            sx={{
              width: '100%',
              pt: 2,
            }}
          >
            <Box
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: `calc(100vw - ${theme.spacing(25)})`,
              }}
            >
              {item.id ? productMap[item.id]?.name : '-'}
            </Box>
          </Box>
        </Box>
      </Box>
      <TableAddSupplierProductStyled>
        <TableBodyInCollapseItemViewStyled>
          {rowData(
            `${translate('sku')}`,
            item.id ? productMap[item.id]?.sku : '-'
          )}
          {rowData(`${translate('vat')} (%)`, formatVat(item.vat) ?? '-')}
          {rowData(
            `${translate('price')} (${DEFAULT_CURRENCY_UNIT.short})`,
            formatPrice(item.price, '')
          )}
          {rowData(
            translate('qty'),
            formatNumberKeepDecimal(
              item.quantity ?? 0,
              NUMBER_DECIMAL_SCALE_MAX
            )
          )}
          {rowData(
            `${translate('amount')} (${DEFAULT_CURRENCY_UNIT.short})`,
            formatMoney(item.amount ?? 0, '')
          )}
          {rowData(`${translate('note')}`, item.note ?? '-')}
        </TableBodyInCollapseItemViewStyled>
      </TableAddSupplierProductStyled>
    </Grid>
  );
};
