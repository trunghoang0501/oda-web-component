import { ArrowForwardOutlined } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Grid,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TableCellTypographyStyled } from '@/components/styled-components/table/TableCellTypographyStyled';
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

const ArrowForwardOutlinedStyled = styled(ArrowForwardOutlined)(
  ({ theme }) => ({
    fontSize: theme.spacing(5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    transform: 'translate(0, 3px)',
    color: theme.palette.text.secondary,
  })
);
export const MobileUpdateProductItemView = ({
  item,
  isFirst,
  isLast,
  productMap,
  attributeMap,
}: {
  item: ISaleOrderProductItem;
  isFirst?: boolean;
  isLast?: boolean;
  productMap: any;
  attributeMap: any;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isReceivedOrder = Object.values(productMap).some(
    (productMapItem: any) => productMapItem.received_quantity !== null
  );
  const rowDataChild = (label: string, child: React.ReactNode) => {
    return (
      <TableRow>
        <TableCellWidth25TypographyStyled>
          {t(label)}
        </TableCellWidth25TypographyStyled>
        <TableCell>{child}</TableCell>
      </TableRow>
    );
  };

  const renderCheckbox = () => {
    const from = attributeMap[item.id].is_checked?.from;
    const to = attributeMap[item.id].is_checked?.to;

    if (!from && !to) {
      return;
    }

    return (
      <TableRow>
        <TableCellWidth25TypographyStyled>
          <Checkbox
            sx={{
              p: 0,
              '&.Mui-disabled': {
                color: '#6e6b7b', // or your desired color
              },
            }}
            disabled
          />
        </TableCellWidth25TypographyStyled>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Checkbox checked={from} />
            <ArrowForwardOutlinedStyled /> <Checkbox checked={to} />
          </Box>
        </TableCell>
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
          {renderCheckbox()}
          {rowDataChild(
            `${translate('sku')}`,
            item.id ? productMap[item.id]?.sku : '-'
          )}
          {rowDataChild(
            `${translate('vat')} (%)`,
            <>
              {attributeMap[item.id].vat && (
                <Typography fontWeight={600}>
                  {formatVat(attributeMap[item.id].vat.from) ?? '-'}{' '}
                  <ArrowForwardOutlinedStyled />{' '}
                  {formatVat(attributeMap[item.id].vat.to) ?? '-'}
                </Typography>
              )}
            </>
          )}
          {rowDataChild(
            `${translate('price')} (${DEFAULT_CURRENCY_UNIT.short})`,
            <>
              {attributeMap[item.id].price && (
                <Typography fontWeight={600}>
                  {formatPrice(attributeMap[item.id].price.from, '')}{' '}
                  <ArrowForwardOutlinedStyled />{' '}
                  {formatPrice(attributeMap[item.id].price.to, '')}
                </Typography>
              )}
            </>
          )}
          {rowDataChild(
            translate('qty'),
            <>
              {attributeMap[item.id].quantity && (
                <Typography fontWeight={600}>
                  {formatNumberKeepDecimal(
                    attributeMap[item.id].quantity.from,
                    NUMBER_DECIMAL_SCALE_MAX
                  )}{' '}
                  <ArrowForwardOutlinedStyled />{' '}
                  {formatNumberKeepDecimal(
                    attributeMap[item.id].quantity.to,
                    NUMBER_DECIMAL_SCALE_MAX
                  )}{' '}
                </Typography>
              )}
            </>
          )}
          {rowDataChild(
            `${translate('amount')} (${DEFAULT_CURRENCY_UNIT.short})`,
            <>
              {attributeMap[item.id].amount && (
                <Typography fontWeight={600}>
                  {formatMoney(attributeMap[item.id].amount.from, '')}{' '}
                  <ArrowForwardOutlinedStyled />{' '}
                  {formatMoney(attributeMap[item.id].amount.to, '')}{' '}
                </Typography>
              )}
            </>
          )}
          {rowDataChild(
            `${translate('note')}`,
            <>
              {attributeMap[item.id].note && (
                <TableCellTypographyStyled sx={{ fontWeight: 500, pt: 4 }}>
                  {translate('note')}: {attributeMap[item.id].note.from ?? '-'}{' '}
                  <ArrowForwardOutlinedStyled />{' '}
                  {attributeMap[item.id].note.to ?? '-'}
                </TableCellTypographyStyled>
              )}
            </>
          )}
        </TableBodyInCollapseItemViewStyled>
      </TableAddSupplierProductStyled>
    </Grid>
  );
};
