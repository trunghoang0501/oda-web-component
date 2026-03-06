import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { isEmpty } from 'rambda';
import { DataGridStyled } from '@/components/common/DataGrid.styled';
import { ColumnSkuStyled } from '@/components/styled-components/ColumnSku';
import { TableCellTypographyStyled } from '@/components/styled-components/table/TableCellTypographyStyled';
import { NUMBER_DECIMAL_SCALE_MAX } from '@/constants';
import { useSettings } from '@/hooks/useSettings';
import { translate } from '@/i18n/translate';
import { ISaleOrderDetail } from '@/types/sale-order';
import {
  DEFAULT_CURRENCY_UNIT,
  LanguageEnum,
  formatNumberKeepDecimal,
} from '@/utils';
import { mediaMobileMax } from '@/utils/constants';
import { formatMoney, formatPrice, formatVat } from '@/utils/monetary-mask';
import { MobileAddProductItemView } from './MobileAddProductItemView';

const columns = (language: LanguageEnum, productMap: any): GridColDef[] => [
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
            {params?.row?.id ? productMap[params.row.id].sku : '-'}
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
          {params?.row?.id ? productMap[params.row.id].name : '-'}
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
    valueFormatter: (params) => formatVat(params?.value),
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
    valueFormatter: (params) => formatPrice(params?.value ?? 0, ''),
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
    valueFormatter: (params) =>
      formatNumberKeepDecimal(params?.value ?? 0, NUMBER_DECIMAL_SCALE_MAX),
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
    valueFormatter: (params) => formatMoney(params?.value ?? 0, ''),
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
        params?.row.note && (
          <TableCellTypographyStyled sx={{ fontWeight: 500, pt: 4 }}>
            {translate('note')}: {params?.row.note}
          </TableCellTypographyStyled>
        )
      );
    },
  },
];

interface IProductListProps {
  products: ISaleOrderDetail['products'];
  productMap: any;
}

const ProductList = ({ products, productMap }: IProductListProps) => {
  const theme = useTheme();
  const { settings } = useSettings();

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
          columns={columns(settings.language, productMap)}
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
        {products.map((product, index) => (
          <MobileAddProductItemView
            productMap={productMap}
            key={`MobileProductItemView${index}`}
            item={product}
            isLast={products.length - 1 === index}
            isFirst={index === 0}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductList;
