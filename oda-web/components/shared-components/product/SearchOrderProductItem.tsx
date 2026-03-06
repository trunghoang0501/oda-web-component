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
import { useSettings } from '@/hooks/useSettings';
import { translate } from '@/i18n/translate';
import {
  ICategoryByInventory,
  IProductCommon,
  ProductSourceEnum,
  VendorStatusEnum,
} from '@/types';
import { LanguageEnum, hexToRGBA } from '@/utils';
import { IMAGE_DEFAULT, mediaMobileMax } from '@/utils/constants';
import { formatPrice, formatVat } from '@/utils/monetary-mask';
import { formatSupplierName } from '@/utils/supplier-info';
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

export const SearchOrderProductItem = <T extends IProductCommon>(
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
  const { settings } = useSettings();
  const language = settings?.language;

  const isResell = !!product.be_resell;
  const getUomName = (uom: any, lang?: LanguageEnum): string => {
    if (typeof uom === 'string') return uom;
    if (!uom) return '';

    return translate(`uom:${uom.name}`);
  };

  const uom = getUomName(product.uom, language);
  const stock = product?.stock ?? 0;
  const specOfUom = product?.specs ?? '';
  const isInternalProduct = product.source?.id === ProductSourceEnum.Own;
  const imageUrl = product.image;
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
  const basePrice = product.base_price;
  const vat = product.vat;
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
      const sourceName = isLocalSupplier
        ? formatSupplierName(product.local_supplier?.name)
        : t('internal');
      return (
        <Box
          sx={{
            color: theme.palette.customColors.tableText,
            fontWeight: 600,
          }}
        >
          {sourceName}
        </Box>
      );
    }

    const localVendorName = formatSupplierName(vendor?.name);
    const remoteVendorName = formatSupplierName(vendorName);

    return (
      <Box
        sx={{
          color: theme.palette.customColors.tableText,
          fontWeight: 600,
        }}
      >
        {!vendor?.is_sync && <Box component="span">{localVendorName}</Box>}
        {vendor?.status.id === VendorStatusEnum.LINKED && !vendor.is_sync && (
          <Box component="span" mx={2}>
            /
          </Box>
        )}
        {vendor?.status.id === VendorStatusEnum.LINKED && (
          <Box
            component="span"
            sx={{
              color: theme.palette.customColors.colorCyan,
            }}
          >
            {remoteVendorName}
          </Box>
        )}
      </Box>
    );
  };
  const url = imageUrl ?? defaultImage;
  const mobile = useMobileDetect();
  return (
    <Box>
      {!mobile.isMobile() && (
        <Box
          sx={{
            display: 'flex',
            width: '98%',
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
                width: theme.spacing(13.5),
                height: theme.spacing(13.5),
                '.productImg': {
                  width: '100% !important',
                  height: '100% !important',
                  borderRadius: theme.spacing(2),
                  objectFit: 'cover',
                },
              }}
            >
              <Image
                thumbnailType={desktopThumbnailType ?? ThumbnailType.SMALL_80}
                className="productImg desktopImage"
                src={url}
                alt=""
                width={54}
                height={54}
                style={{
                  objectFit: 'cover',
                }}
              />
            </Box>
            {!showQuantityColumn && showAdded && (
              <Box
                className="added-indicator"
                sx={{
                  textAlign: 'center',
                  mt: 1,
                  fontWeight: 600,
                  color: theme.palette.error.main,
                }}
              >
                {t('added')}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              fontWeight: 600,
              minWidth: 0,
              flex: 1,
              mr: 4,
              py: 4,
              maxWidth: '40%', // Add a percentage-based max-width for responsiveness
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
              width: theme.spacing(65),
              mr: 4,
              py: 4,
              color: theme.palette.text.secondary,
              [mediaMobileMax]: {
                width: '100%',
              },
            }}
          >
            <Box>{renderCategories()}</Box>

            {(product.sku || showField.findIndex((e) => e === 'sku') >= 0) && (
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
            )}

            {isShowSource && (
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
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
              width: theme.spacing(54),
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
            {showField.findIndex((e) => e === 'stock') >= 0 && (
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box sx={{}}>{t('stock')} -</Box>
                <Box
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.customColors.tableText,
                    pl: 1,
                  }}
                >
                  {' '}
                  {stock}
                </Box>
              </Box>
            )}
            {showField.findIndex((e) => e === 'price') >= 0 && (
              <Box>
                {t('price')} -{' '}
                <Box
                  mt={1}
                  component="span"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.customColors.tableText,
                  }}
                >
                  {basePrice != null && basePrice > price ? (
                    <>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '400',
                          paddingRight: '8px',
                        }}
                      >
                        <del>{formatPrice(basePrice ?? 0)}</del>
                      </span>
                      {formatPrice(price)}
                    </>
                  ) : (
                    formatPrice(price)
                  )}
                  <Box component="span" color="#B9B9C3" fontWeight={400} pl={2}>
                    ({`${t('vat')}: ${formatVat(vat)}`})
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {showQuantityColumn && (
            <Box
              sx={{
                width: theme.spacing(43.5),
                py: 4,
                pr: 4,
                ml: 4,
                textAlign: 'center',
                [mediaMobileMax]: {
                  ml: 0,
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <StepNumberInput
                value={quantity}
                highlight={false}
                onChange={onQuantityChange}
                onBlur={onQuantityBlur}
                disabled={quantityInputDisabled}
                minValue={quantityMin}
                maxValue={DEFAULT_MAX_QUANTITY}
                allowDecimal={allowDecimal}
              />

              {showAdded && (
                <Box
                  sx={{
                    textAlign: 'center',
                    mt: 1,
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  {t('added')}
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
      {/* mobile */}
      {mobile.isMobile() && (
        <Box
          sx={{
            width: '100%',
            color: theme.palette.customColors.tableText,
            backgroundColor: checked
              ? hexToRGBA(theme.palette.primary.main, 0.1)
              : undefined,
            cursor: onClick ? 'pointer' : undefined,
            ...sx,
            display: 'none',
            [mediaMobileMax]: {
              display: 'flex',
              '& p, & div': {
                fontSize: theme.spacing(3.5),
              },
              '& input': {
                p: `${theme.spacing(1)} 0`,
              },
            },
          }}
          onClick={onClick}
        >
          {showCheckbox && (
            <Box
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
                  p: theme.spacing(7.75, 0, 4, 0),
                  width: theme.spacing(6),
                  height: theme.spacing(6),
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  mr: 3,
                  py: 4,
                  ml: showCheckbox ? 0 : 4,
                }}
              >
                <Box
                  sx={{
                    width: theme.spacing(8),
                    height: theme.spacing(8),
                    '.productImg': {
                      width: '100% !important',
                      height: '100% !important',
                      borderRadius: theme.spacing(2),
                      objectFit: 'cover',
                    },
                  }}
                >
                  <Image
                    thumbnailType={
                      mobileThumbnailType ?? ThumbnailType.SMALL_80
                    }
                    className="productImg productImgMobile"
                    src={imageUrl}
                    alt=""
                    width={54}
                    height={54}
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: theme.spacing(3.5),
                    fontWeight: '500',
                    pt: theme.spacing(0.5),
                  }}
                >
                  {product.name}
                </Box>
                <Box
                  sx={{
                    fontSize: theme.spacing(3.5),
                    width: theme.spacing(50),
                  }}
                >
                  {renderCategories()}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: theme.spacing(65),
                mr: 4,
                color: theme.palette.text.secondary,
              }}
            >
              {showField.findIndex((e) => e === 'sku_uom') >= 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ width: theme.spacing(18.75) }}>{t('sku')}</Box>
                  <Box color={theme.palette.text.primary} mr={1}>
                    {product.sku ?? '-'}
                  </Box>
                  <Box ml="auto" sx={{ width: theme.spacing(25) }}>
                    {t('uom')}
                  </Box>
                  <Box color={theme.palette.text.primary}>{uom}</Box>
                </Box>
              )}
              {showField.findIndex((e) => e === 'source') >= 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ width: theme.spacing(25) }}>{t('source')}</Box>
                  <Box color={theme.palette.text.primary}>
                    {renderSourceName()}
                  </Box>
                </Box>
              )}
              {showField.findIndex((e) => e === 'price') >= 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ width: theme.spacing(25) }}>{t('price')}</Box>
                  <Box color={theme.palette.text.primary}>
                    {formatPrice(price)}
                  </Box>
                </Box>
              )}
              {showField.findIndex((e) => e === 'uom') >= 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ width: theme.spacing(25) }}>{t('uom')}</Box>
                  <Box color={theme.palette.text.primary}>{uom}</Box>
                </Box>
              )}
              {showField.findIndex((e) => e === 'quantity') >= 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ width: theme.spacing(25) }}>{t('quantity')}</Box>
                  <Box color={theme.palette.text.primary} fontWeight="500">
                    {showQuantityColumn && (
                      <Box
                        className="abcd"
                        sx={{
                          width: theme.spacing(43.5),
                          py: 4,
                          pr: 4,
                          ml: 4,
                          textAlign: 'center',
                          [mediaMobileMax]: {
                            p: 0,
                            mb: 4,
                            '& .step-number-input__input-col': {
                              width: `${theme.spacing(20)} !important`,
                            },
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <StepNumberInput
                          value={quantity}
                          highlight={false}
                          onChange={onQuantityChange}
                          onBlur={onQuantityBlur}
                          disabled={quantityInputDisabled}
                          minValue={quantityMin}
                          maxValue={DEFAULT_MAX_QUANTITY}
                          allowDecimal={allowDecimal}
                        />

                        {showAdded && (
                          <Box
                            sx={{
                              textAlign: 'center',
                              mt: 1,
                              fontWeight: 600,
                              color: theme.palette.primary.main,
                            }}
                          >
                            {t('added')}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
