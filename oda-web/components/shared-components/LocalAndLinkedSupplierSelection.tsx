import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetLocalSupplierListQuery } from '@/apis';
import { useGetMultiPurchaseOrderSourceListQuery } from '@/apis/multi-purchase-orders';
import { ProductPartnerFilter } from '@/components/shared-components/product-partner-filter';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useInfinityFetchData } from '@/hooks';
import { IIdName, ProductSourceEnum } from '@/types';
import { DEFAULT_LOCAL_SUPPLIER } from '@/utils/constants';
import { IPartnerFilterValue } from './product-partner-filter/types';

interface IProps {
  onChange: (value: IPartnerFilterValue) => void;
  data: IPartnerFilterValue;
  disabled: boolean;
  limitSelect?: number;
}

export const LocalAndLinkedSupplierSelection = (props: IProps) => {
  const { onChange, data, disabled, limitSelect } = props;
  const { t } = useTranslation();
  const [partnerStatus, setPartnerStatus] = useState<ProductSourceEnum>(
    ProductSourceEnum.Own
  );
  const [search, setSearch] = useState('');
  const localPartnersResponse = useInfinityFetchData<IIdName>(
    useGetLocalSupplierListQuery,
    {
      limit: DEFAULT_PAGE_SIZE,
      search,
    },
    {
      skip: disabled,
    }
  );

  const linkedPartnerResponse = useInfinityFetchData<IIdName>(
    useGetMultiPurchaseOrderSourceListQuery,
    {
      limit: DEFAULT_PAGE_SIZE,
      search,
    },
    {
      skip: disabled,
    }
  );

  const {
    combinedData: partners,
    isLoadingMore,
    isFetching,
    refresh,
    readMore,
  } = partnerStatus === ProductSourceEnum.Own
    ? localPartnersResponse
    : linkedPartnerResponse;

  const partnerList =
    partnerStatus === ProductSourceEnum.Own
      ? [DEFAULT_LOCAL_SUPPLIER, ...partners]
      : partners;

  const handleTabChange = (tab: ProductSourceEnum) => {
    setPartnerStatus(tab);
  };

  const handleChange = (value: IPartnerFilterValue) => {
    onChange(value);
  };

  return (
    <ProductPartnerFilter
      value={data}
      onChange={handleChange}
      partners={partnerList}
      isLoadingMore={isLoadingMore}
      isFetching={isFetching}
      refresh={refresh}
      readMore={readMore}
      onSearchChange={setSearch}
      placeholder={t('select_supplier')}
      onTabChange={handleTabChange}
      disabled={disabled}
      limitSelect={limitSelect}
    />
  );
};
