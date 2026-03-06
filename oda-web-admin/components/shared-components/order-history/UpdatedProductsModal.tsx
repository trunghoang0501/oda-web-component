import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useTheme,
  styled,
} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'react-i18next';
import HistoryProductStatus, {
  HistoryProducStatusEnum,
} from './HistoryProductStatus';
import { IIdName, ISaleOrderDetailProductHistory } from '@/types';
import ProductList from './ProductList';
import UpdatedProductList from './UpdatedProductList';

const ProductStatusStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginLeft: theme.spacing(5),
  marginBottom: theme.spacing(2),
  '&:before': {
    content: '""',
    position: 'absolute',
    height: theme.spacing(3),
    width: theme.spacing(3),
    background: theme.palette.customColors.tableBorder,
    borderRadius: '50%',
    left: theme.spacing(-5),
    top: theme.spacing(1.5),
  },
}));

export const UpdatedProductsModal = (props: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data = null, onOk, ...restProps } = props;

  const actionProducts = data.detail.product;
  const products = data.products;
  const actionProductListMap: any = {};
  const productMap: any = {};
  actionProducts.forEach((product: ISaleOrderDetailProductHistory) => {
    actionProductListMap[product.action] = product.items;
  });

  products.forEach((product: IIdName) => {
    productMap[product.id] = product;
  });

  return (
    <Dialog
      PaperProps={{
        sx: {
          minWidth: 1064,
          width: 1064,
          maxWidth: 1064,
          borderRadius: theme.spacing(4),
          boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
        },
      }}
      scroll="body"
      {...restProps}
    >
      <DialogTitle
        className="MuiDialogContent-title"
        sx={{ pb: theme.spacing(6) }}
      >
        {t('updated_product')}
      </DialogTitle>
      <DialogContent>
        {actionProductListMap.add && (
          <Box>
            <ProductStatusStyle>
              <HistoryProductStatus status={HistoryProducStatusEnum.Added} />
            </ProductStatusStyle>
            <ProductList
              products={actionProductListMap.add}
              productMap={productMap}
            />
          </Box>
        )}
        {actionProductListMap.update && (
          <Box>
            <ProductStatusStyle>
              <HistoryProductStatus status={HistoryProducStatusEnum.Updated} />
            </ProductStatusStyle>
            <UpdatedProductList
              products={actionProductListMap.update}
              productMap={productMap}
            />
          </Box>
        )}
        {actionProductListMap.delete && (
          <Box>
            <ProductStatusStyle>
              <HistoryProductStatus status={HistoryProducStatusEnum.Removed} />
            </ProductStatusStyle>
            <ProductList
              products={actionProductListMap.delete}
              productMap={productMap}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ pt: theme.spacing(4), gap: theme.spacing(4) }}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{ width: 100 }}
          onClick={() => onOk()}
        >
          {t('ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
