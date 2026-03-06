import { ArrowForwardOutlined } from '@mui/icons-material';
import { Box, Checkbox, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/system';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { isEmpty } from 'rambda';
import { useTranslation } from 'react-i18next';
import { DataGridStyled } from '@/components/common/DataGrid.styled';
import { MobileUpdateProductItemView } from '@/components/shared-components/order-history/MobileUpdateProductItemView';
import { ColumnSkuStyled } from '@/components/styled-components/ColumnSku';
import { TableCellTypographyStyled } from '@/components/styled-components/table/TableCellTypographyStyled';
import { NUMBER_DECIMAL_SCALE_MAX } from '@/constants';
import { useSettings } from '@/hooks/useSettings';
import { translate } from '@/i18n/translate';
import { ISaleOrderProductItem } from '@/types/sale-order';
import {
  DEFAULT_CURRENCY_UNIT,
  LanguageEnum,
  formatNumberKeepDecimal,
} from '@/utils';
import { mediaMobileMax } from '@/utils/constants';
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

const columns = (
  language: LanguageEnum,
  productMap: any,
  attributeMap: any,
  noneText: string,
  isReceivedOrder: boolean
): GridColDef[] => [
  {
    field: 'is_checked',
    headerName: '',
    minWidth: 120,
    width: 120,
    sortable: false,
    editable: false,
    renderHeader: (params) => {
      return <Checkbox onClick={(event) => event.preventDefault()} />;
    },
    renderCell: (params) => {
      const from = params.row.attributes.find(
        (attr: any) => attr.key === 'is_checked'
      )?.from;
      const to = params.row.attributes.find(
        (attr: any) => attr.key === 'is_checked'
      )?.to;
      if (!from && !to) {
        return;
      }

      return (
        <Box display="flex" alignItems="center">
          <Checkbox checked={from} />
          <ArrowForwardOutlinedStyled /> <Checkbox checked={to} />
        </Box>
      );
    },
  },
  {
    field: 'sku',
    headerName: translate('sku'),
    minWidth: 120,
    width: 120,
    sortable: false,
    editable: false,
    renderCell: (params) => {
      return (
        <ColumnSkuStyled>
          <Typography fontWeight={600}>
            {params?.row?.id ? productMap[params.row.id].sku : noneText}
          </Typography>
        </ColumnSkuStyled>
      );
    },
  },
  {
    field: 'name',
    headerName: translate('product_name'),
    minWidth: 206,
    editable: false,
    sortable: false,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row,
    renderCell: (params) => (
      <ColumnSkuStyled>
        <Typography fontWeight={600}>
          {params?.row?.id ? productMap[params.row.id].name : noneText}
        </Typography>
      </ColumnSkuStyled>
    ),
  },
  {
    field: 'vat',
    headerName: `${translate('vat')} (%)`,
    minWidth: 140,
    width: 140,
    editable: false,
    sortable: false,
    headerAlign: 'right',
    align: 'right',
    renderCell: (params) => (
      <>
        {attributeMap[params.row.id].vat && (
          <Typography fontWeight={600}>
            {formatVat(attributeMap[params.row.id].vat.from) ?? noneText}{' '}
            <ArrowForwardOutlinedStyled />{' '}
            {formatVat(attributeMap[params.row.id].vat.to) ?? noneText}
          </Typography>
        )}
      </>
    ),
  },
  {
    field: 'price',
    headerName: `${translate('price')} (${DEFAULT_CURRENCY_UNIT.short})`,
    type: 'number',
    minWidth: 180,
    width: 180,
    editable: false,
    sortable: false,
    headerAlign: 'right',
    align: 'right',
    renderCell: (params) => (
      <>
        {attributeMap[params.row.id].price && (
          <Typography fontWeight={600}>
            {formatPrice(attributeMap[params.row.id].price.from, '')}{' '}
            <ArrowForwardOutlinedStyled />{' '}
            {formatPrice(attributeMap[params.row.id].price.to, '')}
          </Typography>
        )}
      </>
    ),
  },
  {
    field: 'quantity',
    headerName: translate('qty'),
    sortable: false,
    editable: false,
    minWidth: 140,
    width: 140,
    headerAlign: 'right',
    align: 'right',
    renderCell: (params) => (
      <>
        {attributeMap[params.row.id].quantity && (
          <Typography fontWeight={600}>
            {formatNumberKeepDecimal(
              attributeMap[params.row.id].quantity.from,
              NUMBER_DECIMAL_SCALE_MAX
            )}{' '}
            <ArrowForwardOutlinedStyled />{' '}
            {formatNumberKeepDecimal(
              attributeMap[params.row.id].quantity.to,
              NUMBER_DECIMAL_SCALE_MAX
            )}{' '}
          </Typography>
        )}
      </>
    ),
  },
  {
    field: 'amount',
    headerName: `${translate('amount')} (${DEFAULT_CURRENCY_UNIT.short})`,
    sortable: false,
    editable: false,
    minWidth: 220,
    width: 220,
    headerAlign: 'right',
    align: 'right',
    renderCell: (params) => (
      <>
        {attributeMap[params.row.id].amount && (
          <Typography fontWeight={600}>
            {formatMoney(attributeMap[params.row.id].amount.from, '')}{' '}
            <ArrowForwardOutlinedStyled />{' '}
            {formatMoney(attributeMap[params.row.id].amount.to, '')}{' '}
          </Typography>
        )}
      </>
    ),
  },
  {
    field: 'note',
    headerName: ``,
    sortable: false,
    editable: false,
    headerAlign: 'left',
    align: 'left',
    minWidth: 0,
    width: 0,
    cellClassName: 'column_product_note',
    headerClassName: 'header_product_note',
    renderCell: (params) => {
      return (
        attributeMap[params.row.id].note && (
          <TableCellTypographyStyled sx={{ fontWeight: 500, pt: 4 }}>
            {translate('note')}:{' '}
            {attributeMap[params.row.id].note.from ?? noneText}{' '}
            <ArrowForwardOutlinedStyled />{' '}
            {attributeMap[params.row.id].note.to ?? noneText}
          </TableCellTypographyStyled>
        )
      );
    },
  },
];

interface IProductListProps {
  products: any;
  productMap: any;
}

const UpdatedProductList = ({ products, productMap }: IProductListProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const attributeMap: any = {};

  products.forEach((product: any) => {
    attributeMap[product.id] = {};
    product.attributes.forEach((attr: any) => {
      attributeMap[product.id][attr.key] = attr;
    });
  });

  const isReceivedOrder = Object.values(productMap).some(
    (item: any) => item.received_quantity !== null
  );

  return (
    <Box mb={8}>
      {/* grid table */}
      <Box
        sx={{
          height: '100%',
          width: '100%',
          [mediaMobileMax]: {
            display: 'none',
          },
        }}
      >
        <DataGridStyled
          rows={!isEmpty(products ?? []) ? products : []}
          headerHeight={40}
          autoHeight
          getRowHeight={() => 'auto'}
          columns={columns(
            settings.language,
            productMap,
            attributeMap,
            '',
            isReceivedOrder
          )}
          disableExtendRowFullWidth
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          sortingMode="server"
          hideFooter
          sx={{
            '&.MuiDataGrid-root': {
              cursor: 'pointer',
              border: '1px solid rgba(231, 230, 232, 1)',
              borderRadius: theme.spacing(1.5),
            },
            '& .MuiDataGrid-columnHeaders': {
              background: 'rgba(235, 233, 241, 0.5)',
              '.header_product_note': {
                display: 'none',
              },
            },
            '& .MuiDataGrid-virtualScrollerContent': {
              '& .MuiDataGrid-row': {
                backgroundColor: 'unset',
                flexWrap: 'wrap',
                maxHeight: 'initial !important',
                minWidth: '1146px',
                borderBottom: theme.palette.customColors.tableBorderColor,

                '&:last-child': {
                  borderBottom: 0,
                },

                '.MuiDataGrid-cell': {
                  borderBottom: 'none',
                  padding: theme.spacing(2),
                },

                '.column_product_note': {
                  whiteSpace: 'break-spaces',
                  minHeight: 'initial !important',
                  maxHeight: 'initial !important',
                  maxWidth: 'initial !important',
                  pt: 0,
                  pb: 4,
                  ml: 30,

                  '.MuiTypography-root': {
                    pt: 0,
                  },
                },
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'unset',
              },
            },
          }}
        />
      </Box>

      {/* mobile display */}
      <Box
        display="none"
        sx={{
          [mediaMobileMax]: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {products.map((product: ISaleOrderProductItem, index: number) => (
          <MobileUpdateProductItemView
            productMap={productMap}
            attributeMap={attributeMap}
            key={`MobileUpdateProductItemView${index}`}
            item={product}
            isLast={products.length - 1 === index}
            isFirst={index === 0}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UpdatedProductList;
