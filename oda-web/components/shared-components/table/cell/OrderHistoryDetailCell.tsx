import { Box, List, ListItem, ListItemText } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { t } from 'i18next';
import { equals } from 'rambda';
import React from 'react';
import { TableCellTypographyStyled } from '@/components/styled-components/table/TableCellTypographyStyled';
import { OrderHistoryEnum } from '@/constants';
import {
  DEFAULT_CURRENCY_UNIT,
  LanguageEnum,
  formatMoney,
  formatPrice,
} from '@/utils';

const DISPLAY_DETAIL_STATUSES = [
  OrderHistoryEnum.DraftOrderCreated,
  OrderHistoryEnum.DraftOrderEdited,
  OrderHistoryEnum.OrderCreated,
  OrderHistoryEnum.OrderEdited,
];

const OrderHistoryDetailCell = ({ row }: GridRenderCellParams<any, any>) => {
  if (!DISPLAY_DETAIL_STATUSES.includes(row.action.id)) {
    return null;
  }
  return (
    <Box my={4}>
      <List disablePadding sx={{ listStyleType: 'disc', pl: 4 }}>
        {row?.detail?.payment_method?.name && (
          <ListItem disablePadding sx={{ display: 'list-item' }}>
            <ListItemText
              sx={{ m: 0 }}
              primary={
                <TableCellTypographyStyled>
                  {`${t('payment_method')}: ${row.detail.payment_method.name}`}
                </TableCellTypographyStyled>
              }
            />
          </ListItem>
        )}
        {row?.order_product_history?.map((item: any) => (
          <ListItem key={item.id} disablePadding sx={{ display: 'list-item' }}>
            <ListItemText
              sx={{ m: 0 }}
              primary={
                <TableCellTypographyStyled>
                  [{item.product?.name}] - {t('qty')}:{' '}
                  {formatMoney(item.quantity, '')} - {t('vat')}: {item.vat}% -{' '}
                  {t('price')}:{' '}
                  {formatPrice(
                    item.price,
                    DEFAULT_CURRENCY_UNIT.short,
                    LanguageEnum.vi_VN,
                    2
                  )}
                </TableCellTypographyStyled>
              }
            />
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ display: 'list-item' }}>
          <ListItemText
            sx={{ m: 0 }}
            primary={
              <TableCellTypographyStyled>
                {`${t('shipping_fee')}: ${row?.detail?.shipping_fee}`}
              </TableCellTypographyStyled>
            }
          />
        </ListItem>
      </List>
      <TableCellTypographyStyled sx={{ pl: 4 }}>
        {t('note')}: {row?.detail?.note}
      </TableCellTypographyStyled>
    </Box>
  );
};

export default React.memo(OrderHistoryDetailCell, equals);
