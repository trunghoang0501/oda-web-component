import { Box, Tab, Tabs, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetListSellingProductQuery } from '@/apis';
import { DEFAULT_PAGE } from '@/constants';
import { IProductProps } from '@/containers';
import { ICategory } from '@/types';
import {
  IProductListQueryParams,
  ROUTER_PATH,
  generateBuyProductListUrl,
  generateMyBuyerListUrl,
  generateMySupplierListUrl,
  generateSellProductListUrl,
} from '@/utils';
import {
  ProductListPageTypeEnum,
  ProductPageTypeEnum,
  mediaMobileMax,
} from '@/utils/constants';
import {
  ProductListTabEnum,
  generateProductListUrl,
  getProductListUrlParams,
} from '@/utils/routing/product-list';

const CompanySellingProductTab = ({
  type: productType,
  page: productPage,
  inBuyMenu,
}: IProductProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const urlParams = getProductListUrlParams();
  const router = useRouter();

  const { data: categoryLevel1 } = useGetListSellingProductQuery();

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
  const generateListUrl = (param: IProductListQueryParams) => {
    switch (productPage) {
      case ProductListPageTypeEnum.Buyer:
        return generateMyBuyerListUrl(param);
      case ProductListPageTypeEnum.Supplier:
        return generateMySupplierListUrl(param);
      default:
        switch (productType) {
          case ProductPageTypeEnum.SELL:
            return generateSellProductListUrl({
              ...param,
              productType: getPageType(),
            });
          case ProductPageTypeEnum.PURCHASE:
            return generateBuyProductListUrl({
              ...param,
              productType: getPageType(),
            });
          default:
            return generateProductListUrl({
              ...param,
              productType: getPageType(),
            });
        }
    }
  };
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const param = {
      ...urlParams?.query,
      page: DEFAULT_PAGE,
      categories: [[newValue]],
    };
    const newQueryParam = generateListUrl(param as IProductListQueryParams);
    router.push(newQueryParam);
  };

  return (
    <div>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          marginTop: theme.spacing(1),
        }}
        mb={6}
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
              <Tab key={cat.id} label={cat.name} value={cat.id} />
            ))}
        </Tabs>
      </Box>
    </div>
  );
};

export default CompanySellingProductTab;
