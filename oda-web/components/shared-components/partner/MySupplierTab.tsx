import { Box, Tab, Tabs, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PAGE } from '@/constants';
import { MY_BUYER_TAB_KEY, MyBuyerTabEnum } from '@/constants/sell';
import { IProductProps } from '@/containers';
import { TabLabel } from '@/containers/sales/order-list/components/SellOrderTab/components/OrderListFilter';
import {
  ROUTER_PATH,
  generateBuyProductListUrl,
  generateMyBuyerListUrl,
  generateMySupplierListUrl,
  generateSellProductListUrl,
} from '@/utils';
import {
  MY_BUYER_STATUS,
  ProductListPageTypeEnum,
  ProductPageTypeEnum,
  VENDOR_STATUS,
  mediaMobileMax,
} from '@/utils/constants';
import {
  generateProductListUrl,
  getProductListUrlParams,
} from '@/utils/routing/product-list';

const MySupplierTab = ({
  type: productType,
  page: productPage,
  inBuyMenu,
  counter: vendorCounter,
}: IProductProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const urlParams = getProductListUrlParams();
  const router = useRouter();

  const currentValue = (() => {
    if (!urlParams?.query.tab) {
      return 1;
    }
    return urlParams.query.tab;
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
      tab: newValue,
      status: router.query.status,
    };
    if (productPage === ProductListPageTypeEnum.Buyer) {
      const newQueryParams = generateMyBuyerListUrl(param);
      router.push(newQueryParams);
    } else if (productPage === ProductListPageTypeEnum.Supplier) {
      const newQueryParams = generateMySupplierListUrl(param);
      router.push(newQueryParams);
    } else if (productType === ProductPageTypeEnum.SELL) {
      const newQueryParams = generateSellProductListUrl(param);
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

  const getCounter = (item: MyBuyerTabEnum) => {
    switch (item) {
      case MyBuyerTabEnum.ALL:
        return (
          vendorCounter?.vendor?.reduce(
            (partialSum, a) => partialSum + a.counter,
            0
          ) ?? 0
        );
      case MyBuyerTabEnum.LOCAL:
        return (
          vendorCounter?.vendor?.find((e) => e.status === VENDOR_STATUS.LOCAL)
            ?.counter ?? 0
        );
      case MyBuyerTabEnum.LINK:
        return (
          vendorCounter?.vendor?.find((e) => e.status === VENDOR_STATUS.LINKED)
            ?.counter ?? 0
        );
    }
    return 0;
  };

  const getCounterWaiting = (item: MyBuyerTabEnum) => {
    switch (item) {
      case MyBuyerTabEnum.APPROVAL:
        return vendorCounter?.pending?.counter ?? 0;
      case MyBuyerTabEnum.PENDING:
        return vendorCounter?.approval?.counter ?? 0;
    }
    return 0;
  };

  return (
    <div>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mt: theme.spacing(4),
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
              backgroundColor: inBuyMenu
                ? theme.palette.error.main
                : theme.palette.success.main,
            },
            '& .MuiTab-root, & .MuiTab-root p': {
              [mediaMobileMax]: {
                fontSize: theme.spacing(3.5),
              },
            },
            '& .MuiTab-root.Mui-selected, & .MuiTab-root.Mui-selected *:not(.MuiTypography-caption)':
              {
                color: inBuyMenu
                  ? theme.palette.error.main
                  : theme.palette.success.main,
              },
          }}
        >
          {MY_BUYER_STATUS.map((item) => {
            return (
              <Tab
                value={Number(item)}
                label={
                  <TabLabel
                    label={
                      t(MY_BUYER_TAB_KEY[item]) +
                      (getCounter(item) === 0 ? '' : ` (${getCounter(item)})`)
                    }
                    waitingApproveAmount={getCounterWaiting(item)}
                  />
                }
                key={item}
                sx={{
                  fontWeight: '400',
                  minHeight: 0,
                }}
              />
            );
          })}
        </Tabs>
      </Box>
    </div>
  );
};

export default MySupplierTab;
