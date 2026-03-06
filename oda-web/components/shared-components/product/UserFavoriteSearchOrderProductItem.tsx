import {
  Box,
  BoxProps,
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
  IStepNumberInputProps,
  StepNumberInput,
} from '@/components/shared-components/form/StepNumberInput';
import { DEFAULT_MAX_QUANTITY } from '@/constants';
import { useProductName } from '@/hooks';
import useMobileDetect from '@/hooks/useMobileDetect';
import {
  ICategoryByInventory,
  IProductCommon,
  ProductSourceEnum,
  VendorStatusEnum,
} from '@/types';
import { hexToRGBA } from '@/utils';
import { IMAGE_DEFAULT, mediaMobileMax } from '@/utils/constants';
import { formatPrice, formatVatWithLabel } from '@/utils/monetary-mask';
import {
  formatSupplierName,
  formatSupplierNameWithFallback,
  shouldShowSupplierInfo,
} from '@/utils/supplier-info';
import ProductName from '../table/cell/ProductName';

export enum SearchOrderProductTypeEnum {
  Sale = 'sale',
  Purchase = 'purchase',
}

export interface ISearchOrderProductItemProps<T extends IProductCommon> {
  sx?: BoxProps['sx'];
  product: T;
  showAdded?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  showQuantityColumn?: boolean;
  quantityInputDisabled?: boolean;
  quantity?: IStepNumberInputProps['value'];
  quantityMin?: number;
  onQuantityChange?: IStepNumberInputProps['onChange'];
  onQuantityBlur?: IStepNumberInputProps['onBlur'];
  onClick?: () => void;
  type: SearchOrderProductTypeEnum;
  isShowSource?: boolean;
  allowDecimal?: boolean;
  showField?: string[];
  mobileThumbnailType?: ThumbnailType;
  desktopThumbnailType?: ThumbnailType;
}

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

export const UserFavoriteSearchOrderProductItem = <T extends IProductCommon>(
  props: ISearchOrderProductItemProps<T>
) => {
  const {
    sx,
    product,
    showCheckbox = false,
    showAdded = false,
    checked = false,
    onClick,
    showQuantityColumn = true,
    quantityInputDisabled = false,
    quantity = 0,
    quantityMin = 0,
    onQuantityChange,
    onQuantityBlur,
    type,
    isShowSource = true,
    allowDecimal = true,
    showField = [],
    mobileThumbnailType,
    desktopThumbnailType,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { mapProductName } = useProductName();

  const isResell = !!product.be_resell;
  const uom =
    typeof product.uom === 'string' ? product.uom : product?.uom?.name ?? '';
  const isInternalProduct = product.source?.id === ProductSourceEnum.Own;
  const imageUrl =
    (isResell ? product.resell_info?.image : product.image) ||
    IMAGE_DEFAULT.IMAGE;
  const defaultImage = IMAGE_DEFAULT.IMAGE;

  const price = (() => {
    if (type === SearchOrderProductTypeEnum.Sale && isResell) {
      return product.resell_info.selling_price;
    }
    if (type === SearchOrderProductTypeEnum.Sale && isInternalProduct) {
      return product.selling_price;
    }
    return product.supplier_price;
  })();

  const vat = (() => {
    return product.supplier_vat;
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
              fontSize: theme.spacing(3.5),
            },
          }}
        >
          {firstCateArray.length > 2
            ? `${firstCateArray[0]} > ${firstCateArray[1]}`
            : firstCate}
        </TypographyStyled>
        {(!isEmpty(restCate) || firstCateArray.length > 2) && (
          <Chip
            label={`+${(restCate?.length ?? 0) + firstCateArray.length - 2}`}
            variant="outlined"
            size="small"
            color="secondary"
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.text.secondary,
              fontSize: theme.spacing(3),
              height: theme.spacing(5),
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

  const renderSourceName = () => {
    const vendor = product.vendor;
    const vendorName = vendor?.remote?.name;
    const isLocalSupplier = product?.local_supplier;

    if (isInternalProduct) {
      return (
        <Box
          sx={{
            color: theme.palette.customColors.tableText,
            fontWeight: 600,
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
          color: theme.palette.customColors.tableText,
          fontWeight: 600,
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
  const url = (() => {
    return imageUrl ?? defaultImage;
  })();
  const mobile = useMobileDetect();

  return (
    <Box>
      {!mobile.isMobile() && (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            color: theme.palette.customColors.tableText,
            backgroundColor: checked
              ? hexToRGBA(theme.palette.primary.main, 0.1)
              : undefined,
            cursor: onClick ? 'pointer' : undefined,
            ...sx,
            [mediaMobileMax]: {
              display: 'none',
            },
          }}
          onClick={onClick}
        >
          {showCheckbox && (
            <Box
              sx={{
                width: theme.spacing(6),
                ml: 4,
                mr: 2,
              }}
            >
              <Checkbox
                checked={checked}
                sx={{
                  p: theme.spacing(7.75, 0, 4, 0),
                  width: theme.spacing(6),
                  height: theme.spacing(6),
                }}
              />
            </Box>
          )}

          <Box
            sx={{
              mr: 3,
              py: 4,
              ml: showCheckbox ? 0 : 4,
            }}
          >
            <Box
              sx={{
                width: theme.spacing(13),
                height: theme.spacing(13),
                '.productImg': {
                  width: '100% !important',
                  height: '100% !important',
                  borderRadius: theme.spacing(1.5),
                  objectFit: 'cover',
                },
              }}
            >
              <Image
                thumbnailType={desktopThumbnailType ?? ThumbnailType.SMALL_80}
                className="productImg desktopImage"
                src={url}
                alt=""
                width={52}
                height={52}
                style={{
                  objectFit: 'cover',
                }}
              />
              {product.is_added && (
                <Box
                  sx={{
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      // position: 'absolute',
                      bottom: 4,
                      left: 4,
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.error.main,
                        padding: theme.spacing(0.5, 0),
                        pt: 1,
                        textTransform: 'capitalize',
                        fontSize: '14px',
                        fontWeight: 700,
                      }}
                    >
                      {t('added')}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              fontWeight: 600,
              minWidth: 0,
              flex: 1,
              mr: 4,
              py: 4,
            }}
          >
            <ProductName
              sx={{
                p: 0,
                alignItems: 'center',
              }}
              {...mapProductName({
                name: product.name,
                nameDisplay: product.name_display,
              })}
            />
          </Box>

          <Box
            sx={{
              width: '19rem',
              mr: 4,
              ml: 4,
              py: 4,
              color: theme.palette.text.secondary,
              [mediaMobileMax]: {
                width: '100%',
              },
            }}
          >
            <Box>{renderCategories()}</Box>

            <Box
              sx={{
                mt: 2,
              }}
            >
              {t('sku')} -{' '}
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.customColors.tableText,
                }}
              >
                {product.sku}
              </Box>
            </Box>

            {isShowSource && (
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                {t('source')}&nbsp;-&nbsp;
                {renderSourceName()}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              py: 4,
              mx: 4,
              width: '20rem',
              color: theme.palette.text.secondary,
              [mediaMobileMax]: {
                width: '100%',
              },
            }}
          >
            <Box>
              {t('uom')} -{' '}
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.customColors.tableText,
                }}
              >
                {uom}
              </Box>
            </Box>

            <Box mt={2}>
              {t('spec_of_uom')} -{' '}
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.customColors.tableText,
                }}
              >
                {product.specs}
              </Box>
            </Box>

            <Box
              mt={2}
              sx={{
                display: 'flex',
              }}
            >
              {t('price')} -
              <Box
                component="span"
                sx={{
                  pl: 1,
                  fontWeight: 600,
                  display: 'flex',
                  fontSize: theme.spacing(4),
                  color: theme.palette.customColors.tableText,
                }}
              >
                {Number(product?.base_price) > Number(price) ? (
                  <>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '400',
                        margin: 'auto',
                        paddingRight: '8px',
                      }}
                    >
                      <del>{formatPrice(product?.base_price ?? 0)}</del>
                    </span>
                    {formatPrice(price)}
                  </>
                ) : (
                  formatPrice(price || 0)
                )}
                <Box color="#B9B9C3" fontWeight={400} pl={1}>
                  {formatVatWithLabel(vat, t('vat'))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
