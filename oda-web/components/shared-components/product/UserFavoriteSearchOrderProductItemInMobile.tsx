import {
  Box,
  Checkbox,
  Chip,
  Popover,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { isEmpty } from 'rambda';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ThumbnailType } from '@/components/shared-components/Image';
import {
  ISearchOrderProductItemProps,
  SearchOrderProductTypeEnum,
} from '@/components/shared-components/product/SearchOrderProductItem';
import {
  ICategoryByInventory,
  IProductCommon,
  ProductSourceEnum,
  VendorStatusEnum,
} from '@/types';
import {
  FONT_400,
  FONT_MEDIUM,
  FONT_SEMI_BOLD,
  IMAGE_DEFAULT,
  mediaMobileMax,
} from '@/utils/constants';
import { formatPrice } from '@/utils/monetary-mask';
import { getProductName } from '@/utils/order';
import {
  formatSupplierName,
  formatSupplierNameWithFallback,
  shouldShowSupplierInfo,
} from '@/utils/supplier-info';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  color: theme.palette.customColors.tableText,
  fontSize: theme.spacing(4),
  fontWeight: '600',
  noWrap: true,
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  '& .MuiChip-root': {
    border: `1px solid ${theme.palette.text.secondary}`,
    color: theme.palette.text.secondary,
    fontSize: theme.spacing(3),
    height: theme.spacing(4),
    padding: theme.spacing(0, 1.5),
    marginLeft: theme.spacing(2),
    '& .MuiChip-label': {
      padding: 0,
    },
  },
}));

const CategoryStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.paper,
  display: 'flex',
  boxShadow:
    '0px 2px 2px -3px rgba(58, 53, 65, 0.1),0px 2px 3px 1px rgba(58, 53, 65, 0.1),0px 3px 2px 2px rgba(58, 53, 65, 0.1)',
  borderRadius: 1,
  margin: theme.spacing(2.5),
  width: 'fit-content',
  '&::before': {
    backgroundColor: theme.palette.background.paper,
    content: '""',
    display: 'block',
    position: 'absolute',
    width: 12,
    height: 12,
    transform: 'rotate(45deg)',
    bottom: -6,
    left: `calc(50% - ${theme.spacing(1.5)})`,
  },
}));

/**
 Use only in `SearchOrderProductModal` component in edit/create po/so page
 */

export const UserFavoriteSearchOrderProductItemInMobile = <
  T extends IProductCommon
>(
  props: ISearchOrderProductItemProps<T>
) => {
  const {
    product,
    showCheckbox = false,
    checked = false,
    onClick,
    type,
    showField = [],
    showAdded = false,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const isResell = !!product.be_resell;
  const uom =
    typeof product.uom === 'string' ? product.uom : product?.uom?.name ?? '';

  const isInternalProduct = product.source?.id === ProductSourceEnum.Own;
  const imageUrl =
    (isResell ? product.resell_info?.image : product.image) ||
    IMAGE_DEFAULT.IMAGE;

  const price = (() => {
    if (type === SearchOrderProductTypeEnum.Sale && isResell) {
      return product.resell_info.selling_price;
    }
    if (type === SearchOrderProductTypeEnum.Sale && isInternalProduct) {
      return product.selling_price;
    }
    return product.supplier_price;
  })();

  const categoryToString = (category: ICategoryByInventory): string => {
    if (!category?.child) {
      return category?.name;
    }
    if (!category?.name) {
      return '';
    }
    return `${category?.name ?? ''} > ${categoryToString(category?.child)}`;
  };

  const categories = useMemo(() => {
    let res: string[] = [];
    product.categories?.forEach((cate: any) => {
      res = [...res, categoryToString(cate)];
    });
    return res;
  }, [product.categories]);

  const renderCategories = () => {
    const [firstCate, ...restCate] = categories;

    const open = Boolean(anchorEl);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };
    const firstCateArray = (firstCate ?? '').split(' > ');
    const hasChip = !isEmpty(restCate) || firstCateArray.length > 2;
    return (
      <Stack
        direction="row"
        spacing={4}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{ width: '100%' }}
        alignItems="center"
      >
        <TypographyStyled
          sx={{
            fontWeight: '400',
            display: 'block',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: theme.palette.text.secondary,
            [mediaMobileMax]: {
              color: theme.palette.customColors.chipLabelMobile,
              fontSize: theme.spacing(3.5),
              maxWidth: `calc(100vw - ${theme.spacing(hasChip ? 56 : 44)})`,
            },
          }}
        >
          {firstCateArray.length > 2
            ? `${firstCateArray[0]} > ${firstCateArray[1]}`
            : firstCate}
        </TypographyStyled>
        {hasChip && (
          <Chip
            label={`+${(restCate?.length ?? 0) + firstCateArray.length - 2}`}
            variant="outlined"
            size="small"
            color="secondary"
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.text.secondary,
              fontSize: theme.spacing(3.5),
              height: theme.spacing(5),
              fontWeight: FONT_400,
              display: 'flex',
              alignItems: 'center',
            }}
          />
        )}
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          PaperProps={{
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
        >
          <CategoryStyled
            sx={{
              m: 2.5,
              direction: 'row',
            }}
          >
            {categories.map((cate, inx) => {
              return (
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.common.white,
                    borderRadius: theme.spacing(1.2),
                    overflow: 'hidden',
                  }}
                  key={inx?.toString()}
                >
                  <Chip
                    label={cate}
                    variant="outlined"
                    size="small"
                    color="secondary"
                  />
                </Box>
              );
            })}
          </CategoryStyled>
        </Popover>
      </Stack>
    );
  };

  const hasSpaceInSourceName = () => {
    if (!product) return false;
    const vendor = product.vendor;
    const vendorName = vendor?.remote?.name;
    const isLocalSupplier = product?.local_supplier;
    if (isInternalProduct) {
      return (
        (isLocalSupplier
          ? product?.local_supplier?.name
          : product?.source?.name
        )?.includes(' ') ?? false
      );
    }
    return ((!vendor?.is_sync ? vendor!.name : '') + vendorName).includes(' ');
  };
  const renderSourceName = () => {
    const vendor = product.vendor;
    const vendorName = vendor?.remote?.name;
    const isLocalSupplier = product?.local_supplier;

    if (isInternalProduct) {
      return (
        <Box
          sx={{
            wordBreak: hasSpaceInSourceName() ? 'break-word' : 'break-all',
          }}
        >
          {isLocalSupplier
            ? formatSupplierNameWithFallback(
                product.local_supplier?.name,
                product?.source?.name || ''
              )
            : formatSupplierName(product?.source?.name)}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          wordBreak: hasSpaceInSourceName() ? 'break-word' : 'break-all',
        }}
      >
        {!vendor?.is_sync && (
          <Box component="span">{formatSupplierName(vendor?.name)}</Box>
        )}
        {vendor?.status.id === VendorStatusEnum.LINKED && !vendor.is_sync && (
          <Box component="span" mx={2}>
            /
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: shouldShowSupplierInfo()
              ? theme.palette.customColors.colorCyan
              : theme.palette.customColors.tableText,
          }}
        >
          {formatSupplierName(vendorName)}
        </Box>
      </Box>
    );
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        borderBottom: `1px solid ${theme.palette.customColors.tableBorder}`,
        mb: 3,
      }}
    >
      {showCheckbox && (
        <Box
          onClick={onClick}
          className="checkBoxColumn"
          sx={{
            width: theme.spacing(6),
            ml: 0,
            mr: 0,
          }}
        >
          <Checkbox
            checked={checked}
            sx={{
              p: theme.spacing(4, 0, 4, 0),
              width: theme.spacing(6),
              height: theme.spacing(6),
            }}
          />
        </Box>
      )}
      <Box
        pl={theme.spacing(1)}
        flexGrow={1}
        display="flex"
        fontSize={theme.spacing(3.5)}
        mb={2}
        flexDirection="column"
      >
        <Box display="flex">
          <Box onClick={onClick} display="flex" flexDirection="column" pt={0}>
            <Image
              thumbnailType={ThumbnailType.SMALL_80}
              alt={product.name}
              defaultSrc={imageUrl}
              src={imageUrl}
              style={{
                width: theme.spacing(18),
                height: theme.spacing(18),
                borderRadius: theme.spacing(2),
              }}
            />
            {(showAdded || product.is_added) && (
              <Box
                sx={{
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: theme.palette.error.main,
                      color: 'white',
                      borderRadius: 10,
                      padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                      textTransform: 'capitalize',
                      fontSize: '10px',
                    }}
                  >
                    {t('added')}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              pl: 2,
            }}
          >
            <Box
              onClick={onClick}
              display="flex"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Box
                sx={{
                  fontWeight: FONT_SEMI_BOLD,
                  fontSize: theme.spacing(4),
                }}
              >
                {getProductName(product)}
              </Box>
            </Box>
            <Box
              onClick={onClick}
              fontSize={theme.spacing(3.5)}
              fontWeight={FONT_MEDIUM}
              pb={1}
            >
              {renderCategories()}
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {showField.findIndex((e) => e === 'uom') >= 0 && (
                <Box
                  onClick={onClick}
                  sx={{
                    fontSize: theme.spacing(3.5),
                    fontWeight: FONT_400,
                    flexGrow: 1,
                  }}
                >
                  {uom} {product.specs ? `/ ${product.specs}` : ''}
                </Box>
              )}
              {showField.findIndex((e) => e === 'price') >= 0 && (
                <Box
                  onClick={onClick}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Box
                    sx={{
                      fontSize: theme.spacing(4),
                      fontWeight: FONT_MEDIUM,
                      flexGrow: 1,
                    }}
                  >
                    {formatPrice(price)}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          pt={2}
          onClick={onClick}
          sx={{
            display: 'table',
            '& > div': {
              display: 'table-cell',
            },
          }}
        >
          {showField.findIndex((e) => e === 'source') >= 0 && (
            <>
              <Box width={theme.spacing(18)}>{t('source')}</Box>
              <Box
                pl={2}
                flexGrow={1}
                sx={{
                  fontSize: theme.spacing(3.5),
                  fontWeight: FONT_MEDIUM,
                }}
              >
                <Box>{renderSourceName()}</Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
