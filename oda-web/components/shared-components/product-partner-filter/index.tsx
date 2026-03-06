import {
  AutocompleteRenderGetTagProps,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import debounce from 'debounce';
import { isEmpty } from 'rambda';
import {
  Dispatch,
  FocusEvent,
  HTMLAttributes,
  JSXElementConstructor,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetListPurchaseVendorQuery,
  useGetListVendorsQuery,
  useGetLocalSupplierListQuery,
} from '@/apis';
import { DEFAULT_PAGE_SIZE, LIMIT_ALL_ITEM } from '@/constants';
import useMobileDetect from '@/hooks/useMobileDetect';
import {
  IIdName,
  IVendorCommon,
  ProductSourceEnum,
  VendorPurposeEnum,
} from '@/types';
import { INPUT_DEBOUNCE_TIME } from '@/utils/constants';
import { formatSupplierName } from '@/utils/supplier-info';
import { VirtualizeAutocomplete } from '../form/VirtualizeAutocomplete';
import {
  ILocalAndLinkedPartnerPopperProps,
  LocalAndLinkedPartnerPopper,
} from './components/LocalAndLinkedPartnersPopper';
import {
  LOCAL_AND_LINKED_PARTNER_TAB_CLASS_NAME,
  PartnerTabEnum,
} from './constants';
import { IPartnerFilterValue, ISupplierOption } from './types';

interface IProductPartnerFilterProps {
  partners: IIdName[];
  placeholder?: string;
  isLoadingMore: boolean;
  isFetching: boolean;
  refresh: () => void;
  readMore: () => void;
  onSearchChange: Dispatch<SetStateAction<string>>;
  value: IPartnerFilterValue;
  onChange: (value: IPartnerFilterValue) => void;
  onTabChange: (tab: ProductSourceEnum) => void;
  disabled?: boolean;
  triggerOpen?: boolean;
  onCloseEvent?: () => void;
  onOpenEvent?: () => void;
  limitSelect?: number | undefined;
}

export const ProductPartnerFilter = (props: IProductPartnerFilterProps) => {
  const {
    partners,
    placeholder,
    isFetching,
    isLoadingMore,
    readMore,
    refresh,
    onSearchChange,
    onChange,
    onTabChange,
    value,
    disabled = false,
    triggerOpen = false,
    onCloseEvent = () => {},
    onOpenEvent = () => {},
    limitSelect = LIMIT_ALL_ITEM,
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const [clearOnBlur, setClearOnBlur] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState<PartnerTabEnum>(
    PartnerTabEnum.Local
  );

  const localPartnersResponse = useGetLocalSupplierListQuery({
    limit: DEFAULT_PAGE_SIZE,
    vendor_ids: value.localSupplierSelected.map((item) => item.id),
  });

  const linkedPartnerResponse = useGetListPurchaseVendorQuery({
    purposes: [VendorPurposeEnum.Supplier, VendorPurposeEnum.Both],
    partner_ids: value.linkedPartnerSelected.map((item) => item.id),
  });
  const originValue = [
    ...value.linkedPartnerSelected.map((item) => item.id),
    ...value.localSupplierSelected.map((item) => item.id),
  ];
  const { data: initialListResp } = useGetListVendorsQuery(
    {
      partner_ids: originValue,
    },
    {
      skip: !originValue || isEmpty(originValue),
    }
  );

  const currentValue = useMemo(
    () => [
      ...value.localSupplierSelected.map((partner) => ({
        id: `${ProductSourceEnum.Own}_${partner.id}`,
        supplierId: partner.id,
        name: partner.name,
        type: ProductSourceEnum.Own,
      })),
      ...value.linkedPartnerSelected.map((partner) => ({
        id: `${ProductSourceEnum.Vendor}_${partner.id}`,
        supplierId: partner.id,
        name: partner.name,
        type: ProductSourceEnum.Vendor,
      })),
    ],
    [value]
  );

  const partnerList: ISupplierOption[] = useMemo(() => {
    const type =
      activeTab === PartnerTabEnum.Local
        ? ProductSourceEnum.Own
        : ProductSourceEnum.Vendor;
    return partners.map((partner) => ({
      id: `${type}_${partner.id}`,
      supplierId: partner.id,
      name: partner.name,
      type,
    }));
  }, [partners]);

  const searchChangeHandler = (val: string) => {
    onSearchChange(val);
  };

  const debouncedSearchChange = useMemo(
    () => debounce(searchChangeHandler, INPUT_DEBOUNCE_TIME),
    []
  );

  const handleSearchChange = (
    event: SyntheticEvent<Element, Event>,
    val: string,
    reason?: any
  ) => {
    if (reason === 'reset' && !!event && val.length === 0) return;
    setSearchValue(val);
    refresh();
    debouncedSearchChange(val);
  };

  const onClose = (event: SyntheticEvent<Element, Event>) => {
    if (
      (event as FocusEvent<HTMLInputElement>).relatedTarget?.classList.contains(
        LOCAL_AND_LINKED_PARTNER_TAB_CLASS_NAME
      )
    ) {
      (event as FocusEvent<HTMLInputElement>).target?.focus();
    } else {
      onCloseEvent();
      setOpen(false);
      setClearOnBlur(true);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setClearOnBlur(false);
    onSearchChange('');
    onOpenEvent();
  };

  const handleTabChange = (tab: PartnerTabEnum) => {
    setActiveTab(tab);
    onTabChange(
      tab === PartnerTabEnum.Local
        ? ProductSourceEnum.Own
        : ProductSourceEnum.Vendor
    );
    setSearchValue(searchValue);
    debouncedSearchChange(searchValue);
    refresh();
  };

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    val: ISupplierOption[]
  ) => {
    const localSupplierSelected: IIdName[] = [];
    const linkedPartnerSelected: IIdName[] = [];

    val.forEach((supplier) => {
      const totalSelected =
        localSupplierSelected.length + linkedPartnerSelected.length;
      if (totalSelected < limitSelect) {
        if (supplier.type === ProductSourceEnum.Own) {
          localSupplierSelected.push({
            id: supplier.supplierId,
            name: supplier.name,
          });
        } else {
          linkedPartnerSelected.push({
            id: supplier.supplierId,
            name: supplier.name,
          });
        }
      }
    });

    onChange({
      localSupplierSelected,
      linkedPartnerSelected,
    });
  };

  const getNameFromInit = (option: ISupplierOption, isLinked: boolean) => {
    if (isLinked) {
      const item = (initialListResp?.data ?? []).find(
        (item1: IVendorCommon) =>
          item1?.remote?.id === Number(option.supplierId)
      );
      return item?.remote?.name;
    }
    const item = (initialListResp?.data ?? []).find(
      (item1: IVendorCommon) => item1?.id === Number(option.supplierId)
    );
    return item?.name ?? '';
  };
  const getName = (option: ISupplierOption) => {
    if (option.name.length > 0) return option.name;
    if (option.type === ProductSourceEnum.Vendor) {
      const item = (linkedPartnerResponse?.data?.data ?? []).find(
        (item1) => item1?.remote?.id === Number(option.supplierId)
      );
      return item?.remote?.name ?? getNameFromInit(option, true);
    }
    if (option.supplierId === 0) return t('internal');
    const item = (localPartnersResponse?.data?.data ?? []).find(
      (item1) => item1.id === Number(option.supplierId)
    );
    return item?.name ?? getNameFromInit(option, false);
  };
  const renderTags = (
    values: ISupplierOption[],
    getTagProps: AutocompleteRenderGetTagProps
  ) => {
    return values.map((option: ISupplierOption, index: number) => (
      <Chip
        {...getTagProps({ index })}
        key={option?.id}
        label={
          option.type === ProductSourceEnum.Vendor ? (
            <Box component="span" color={theme.palette.customColors.colorCyan}>
              {formatSupplierName(getName(option))}
            </Box>
          ) : (
            <>{formatSupplierName(getName(option))}</>
          )
        }
      />
    ));
  };
  useEffect(() => {
    setOpen(triggerOpen);
  }, [triggerOpen]);
  const mobile = useMobileDetect();
  return (
    <VirtualizeAutocomplete
      open={open}
      multiple
      options={partnerList}
      placeholder={placeholder}
      getOptionLabel={(option) => formatSupplierName(option?.name) ?? ''}
      isOptionEqualToValue={(option, val) =>
        option?.supplierId === val?.supplierId && option?.type === val?.type
      }
      inputValue={searchValue}
      onInputChange={handleSearchChange}
      onClose={onClose}
      onOpen={handleOpen}
      limitTags={2}
      onChange={handleChange}
      lazyLoadProps={{
        isLoadingMore,
        isFetching,
        onFetchMore: readMore,
      }}
      value={currentValue}
      componentsProps={{
        popper: {
          className: 'select-popper-filter',
          sx: {
            width: `${theme.spacing(130)}!important`,
            ...(activeTab === PartnerTabEnum.Linked && {
              '.MuiAutocomplete-option': {
                color: theme.palette.customColors.colorCyan,
              },
            }),
          },
          placement: mobile.isMobile() ? 'top' : 'bottom-end',
          modifiers: mobile.isMobile()
            ? [
                {
                  name: 'flip',
                  enabled: false,
                },
                {
                  name: 'preventOverflow',
                  enabled: false,
                },
                {
                  name: 'offset',
                  options: {
                    offset: [50, 0], // [horizontal, vertical] - positive horizontal moves right
                  },
                },
              ]
            : undefined,
        },
        paper: {
          activeTab,
          setActiveTab: handleTabChange,
        } as ILocalAndLinkedPartnerPopperProps,
      }}
      PaperComponent={
        LocalAndLinkedPartnerPopper as JSXElementConstructor<
          HTMLAttributes<HTMLElement>
        >
      }
      clearOnBlur={clearOnBlur}
      size="small"
      showCheckbox
      renderTags={renderTags}
      disabled={disabled}
      triggerOpen={triggerOpen}
    />
  );
};
