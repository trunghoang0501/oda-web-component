import { Box, Tab, Tabs, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetProductCategoryListQuery } from '@/apis';
import { DEFAULT_PAGE } from '@/constants';
import { IProductProps } from '@/containers';
import { ICategory } from '@/types';
import {
  ROUTER_PATH,
  generateBuyProductListUrl,
  generateMySupplierListUrl,
  generateSellProductListUrl,
} from '@/utils';
import {
  ProductListPageTypeEnum,
  ProductPageTypeEnum,
  mediaMobileMax,
} from '@/utils/constants';
import {
  generateMyBuyerDetailUrl,
  generateMySupplierDetailUrl,
} from '@/utils/routing/partner-group-list';
import {
  ProductListTabEnum,
  generateProductListUrl,
  getProductListUrlParams,
} from '@/utils/routing/product-list';

const ProductCategories = ({
  type: productType,
  page: productPage,
  inBuyMenu,
  supplierId,
}: IProductProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const urlParams = getProductListUrlParams();
  const router = useRouter();

  const { data: categoryLevel1 } = useGetProductCategoryListQuery(0);

  const currentValue = (() => {
    if (!urlParams?.query.categories) {
      return 0;
    }
    return urlParams.query.categories[0][0];
  })();

  const path = useMemo(() => router.asPath, [router]);

  const getPageType = () => {
    if (path.includes(`${ROUTER_PATH.BUY}/`))
      return ProductPageTypeEnum.PURCHASE;
    return path.includes(`${ROUTER_PATH.SALE}/`)
      ? ProductPageTypeEnum.SELL
      : ProductPageTypeEnum.ALL;
  };
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const param = {
      ...urlParams?.query,
      page: DEFAULT_PAGE,
      categories: newValue === 0 ? [[]] : [[newValue]],
      supplierId,
    };
    if (productPage === ProductListPageTypeEnum.Supplier) {
      const newQueryParams = generateMySupplierListUrl(param);
      router.push(newQueryParams);
    } else if (productPage === ProductListPageTypeEnum.BuyerDetail) {
      const newQueryParams = generateMyBuyerDetailUrl(param);
      router.push(newQueryParams);
    } else if (productPage === ProductListPageTypeEnum.SupplierDetail) {
      const newQueryParams = generateMySupplierDetailUrl({ ...param });
      router.push(newQueryParams);
    } else if (productType === ProductPageTypeEnum.SELL) {
      const newQueryParams = generateSellProductListUrl({
        ...param,
        productType: getPageType(),
      });
      router.push(newQueryParams);
    } else if (productType === ProductPageTypeEnum.PURCHASE) {
      const newQueryParams = generateBuyProductListUrl({
        ...param,
        productType: getPageType(),
      });
      router.push(newQueryParams);
    } else {
      const newQueryParams = generateProductListUrl({
        ...param,
        productType: getPageType(),
      });
      router.push(newQueryParams);
    }
  };

  return (
    <div>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mt: theme.spacing(4),
          [mediaMobileMax]: {
            mt: 0,
          },
        }}
      >
        <Tabs
          value={currentValue}
          onChange={handleChange}
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-scroller': {
              overflow: 'auto !important',
            },
            '& .MuiButtonBase-root': {
              minHeight: 'unset',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: inBuyMenu ? theme.palette.error.main : undefined,
            },
            '& .MuiTab-root, & .MuiTab-root p': {
              [mediaMobileMax]: {
                fontSize: theme.spacing(3.5),
              },
            },
            '& .MuiTab-root.Mui-selected': {
              color: inBuyMenu ? theme.palette.error.main : undefined,
            },
          }}
        >
          <Tab label={t('all')} value={ProductListTabEnum.All} />
          {categoryLevel1?.data &&
            categoryLevel1?.data.map((cat: ICategory) => (
              <Tab label={cat.name} value={cat.id} />
            ))}
        </Tabs>
      </Box>
    </div>
  );
};

export default ProductCategories;
