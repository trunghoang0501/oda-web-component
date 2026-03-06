import { SearchRounded } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  MenuItem,
  PopperProps,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import debounce from 'debounce';
import {
  ChangeEvent,
  UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { useGetLocalSupplierListQuery } from '@/apis';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useInfinityFetchData } from '@/hooks';
import { IVendorCommon } from '@/types';
import { hexToRGBA, isScrollToBottom } from '@/utils';
import {
  DEFAULT_LOCAL_SUPPLIER,
  INPUT_DEBOUNCE_TIME,
  OFFSET_BOTTOM_TRIGGER_LOAD_MORE,
} from '@/utils/constants';
import { formatSupplierName } from '@/utils/supplier-info';
import { BoxContainerStyled, PopperStyled } from './styles';

interface IDefaultSupplierSelectPopperProps extends PopperProps {
  onClose: () => void;
  onSelectSupplier: (supplier: IVendorCommon) => void;
  selectedSupplier?: IVendorCommon;
  vendorIdsByProduct?: number[] | undefined;
  disablePortal?: boolean;
  notShowInternalSupplier?: boolean;
}

export const DefaultSupplierSelectPopper = (
  props: IDefaultSupplierSelectPopperProps
) => {
  const {
    open,
    onClose,
    onSelectSupplier,
    vendorIdsByProduct,
    selectedSupplier,
    disablePortal,
    notShowInternalSupplier,
    ...restProps
  } = props;
  const id = open ? 'default-supplier' : undefined;
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [searchParam, setSearchParam] = useState('');
  const [vendorIds, setVendorIds] = useState<number[]>([]);

  const {
    combinedData: localSuppliers,
    isFetching,
    isLoadingMore,
    refresh,
    readMore,
  } = useInfinityFetchData(useGetLocalSupplierListQuery, {
    limit: DEFAULT_PAGE_SIZE,
    search: searchParam,
    not_in_vendor_ids: vendorIds,
  });

  useEffect(() => {
    if (vendorIdsByProduct?.length) {
      setVendorIds(vendorIdsByProduct);
    }
  }, [vendorIdsByProduct]);

  const supplierList = notShowInternalSupplier
    ? localSuppliers
    : [DEFAULT_LOCAL_SUPPLIER, ...localSuppliers];

  const searchChangeHandler = (value: string) => {
    setSearchParam(value);
    refresh();
  };

  const debouncedSearchChange = useMemo(
    () => debounce(searchChangeHandler, INPUT_DEBOUNCE_TIME),
    []
  );

  const handleSearchChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value);
    debouncedSearchChange(value);
  };

  const supplierRow = (index: number, supplier: IVendorCommon) => {
    const isSelected = selectedSupplier?.id === supplierList[index]?.id;

    return (
      <MenuItem
        sx={{
          px: 6,
          ...(isSelected
            ? {
                backgroundColor: theme.palette.customColors.selectedItemBg,
                '&:hover': {
                  backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12),
                },
              }
            : {
                '&:hover': { backgroundColor: theme.palette.action.hover },
              }),
          cursor: 'pointer',
        }}
        onClick={() => {
          onSelectSupplier(supplier);
          onClose();
        }}
      >
        <Typography>{formatSupplierName(supplier.name)}</Typography>
      </MenuItem>
    );
  };

  const footer = () => {
    if (isLoadingMore) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            height: theme.spacing(10),
          }}
        >
          <CircularProgress size={theme.spacing(8)} />
        </Box>
      );
    }

    return <></>;
  };

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, offsetHeight } = event.currentTarget;
      if (
        isScrollToBottom(
          scrollTop,
          scrollHeight,
          offsetHeight,
          OFFSET_BOTTOM_TRIGGER_LOAD_MORE
        ) &&
        readMore &&
        !isLoadingMore
      ) {
        readMore();
      }
    },
    [readMore, isLoadingMore]
  );

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={onClose}
    >
      <PopperStyled
        id={id}
        open={open}
        disablePortal={disablePortal}
        {...restProps}
      >
        <Box mt={4} mx={6} mb={2}>
          <TextField
            fullWidth
            placeholder={t('search_local_supplier_name')}
            size="small"
            InputProps={{
              startAdornment: (
                <SearchRounded sx={{ color: theme.palette.text.secondary }} />
              ),
            }}
            value={searchValue}
            onChange={handleSearchChange}
            sx={{
              '.MuiInputBase-root': {
                '.MuiInputBase-input': {
                  fontWeight: 400,
                },
                gap: theme.spacing(2),
              },
            }}
          />
        </Box>
        <BoxContainerStyled onScroll={handleScroll}>
          {isFetching && !isLoadingMore ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: theme.spacing(30),
              }}
            >
              <CircularProgress size={theme.spacing(8)} />
            </Box>
          ) : (
            <Virtuoso
              data={supplierList}
              itemContent={supplierRow}
              overscan={20}
              components={{ Footer: footer }}
            />
          )}
        </BoxContainerStyled>
      </PopperStyled>
    </ClickAwayListener>
  );
};
