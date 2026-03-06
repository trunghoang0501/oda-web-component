import { ISaleOrderDetail } from '@/types/sale-order';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { isEmpty } from 'rambda';
import { DataGridStyled } from '@/components/common/DataGrid.styled';
import {
  ColumnSkuStyled,
  TableCellTypographyStyled,
} from '@/components/styled-components/table/TableCellTypographyStyled';
import { translate } from '@/i18n/translate';
import { DEFAULT_CURRENCY_UNIT, formatMoney, LanguageEnum } from '@/utils';
import { useSettings } from '@/hooks/useSettings';

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
    minWidth: 246,
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
    valueFormatter: (params) => formatMoney(params?.value, ''),
  },
  {
    field: 'quantity',
    headerName: translate('qty'),
    sortable: false,
    editable: false,
    minWidth: 100,
    width: 100,
    headerAlign: 'right',
    align: 'right',
    valueFormatter: (params) =>
      formatMoney(params?.value, '', LanguageEnum.vi_VN, 2),
  },
  {
    field: 'amount',
    headerName: `${translate('amount')} (${DEFAULT_CURRENCY_UNIT.short})`,
    sortable: false,
    editable: false,
    minWidth: 200,
    width: 200,
    headerAlign: 'right',
    align: 'right',
    valueFormatter: (params) =>
      formatMoney(params?.value, '', LanguageEnum.vi_VN, 2),
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
      <Box sx={{ height: '100%', width: '100%' }}>
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
              '& .MuiDataGrid-row.Mui-selected .MuiButtonBase-root': {
                color: theme.palette.success.main,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductList;
