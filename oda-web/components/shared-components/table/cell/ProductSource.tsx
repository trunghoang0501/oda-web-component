import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Image, ThumbnailType } from '@/components/shared-components/Image';
import { IResellProduct, ProductSourceEnum } from '@/types';

interface IProductSourceProps {
  product: IResellProduct;
}

const ProductSource = ({ product }: IProductSourceProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { vendor, local_supplier: localSupplier, source } = product;

  const isSyncVendor =
    product.source?.id === ProductSourceEnum.Vendor && vendor?.is_sync;
  const isLocalProduct = source?.id === ProductSourceEnum.Own;
  const sourceContent = (() => {
    if (isLocalProduct) {
      return localSupplier?.name || t('internal');
    }
    return vendor?.remote?.name;
  })();

  const textColor = isLocalProduct
    ? theme.palette.customColors.tableText
    : theme.palette.customColors.colorCyan;

  return (
    <Stack direction="row" gap={2} alignItems="center">
      {!isLocalProduct && (
        <Image
          thumbnailType={ThumbnailType.SMALL_40}
          src={vendor?.remote?.picture || vendor?.default_picture}
          style={{
            width: theme.spacing(10),
            height: theme.spacing(10),
            borderRadius: theme.spacing(1.5),
            objectFit: 'cover',
          }}
          alt=""
        />
      )}
      <Box>
        {isSyncVendor && (
          <Typography
            fontWeight={600}
            color={theme.palette.customColors.tableText}
          >
            {vendor?.name}
          </Typography>
        )}
        <Typography fontWeight={600} color={textColor}>
          {sourceContent}
        </Typography>
      </Box>
    </Stack>
  );
};

export default ProductSource;
