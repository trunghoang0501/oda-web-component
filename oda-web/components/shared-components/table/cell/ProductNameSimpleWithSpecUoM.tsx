import {
  Box,
  Stack,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { memo } from 'react';
import { Image, ThumbnailType } from '@/components/shared-components/Image';
import { IProduct } from '@/types';

interface IProductNameSimpleProps {
  productName: string;
  sx?: SxProps<Theme>;
  extendData?: {
    productImage?: string;
    defaultImage?: string;
  };
  showCategories?: boolean;
  spec: string;
  product?: IProduct;
}

const ProductNameSimpleWithSpecUom = (props: IProductNameSimpleProps) => {
  const { productName, extendData, sx, showCategories, product, spec } = props;

  const mergedSx: SxProps<Theme> = {
    py: 4,
    ...sx,
  };
  const theme = useTheme();
  return (
    <Box sx={mergedSx}>
      <Stack direction="row" gap={2} alignItems="center">
        {extendData?.productImage && (
          <Box
            width={theme.spacing(10)}
            height={theme.spacing(10)}
            sx={{
              position: 'relative',
              '& .product-img': {
                borderRadius: theme.spacing(1.5),
                display: 'block',
                objectFit: 'cover',
              },
            }}
          >
            <Image
              thumbnailType={ThumbnailType.SMALL_40}
              className="product-img"
              src={extendData?.productImage ?? extendData?.defaultImage}
              alt=""
              width={40}
              height={40}
              style={{
                objectFit: 'cover',
              }}
            />
          </Box>
        )}
        <Stack flex={1} gap={0}>
          <Stack
            direction="column"
            gap={1}
            alignItems="start"
            minWidth={theme.spacing(6)}
          >
            <Typography
              color={theme.palette.customColors.tableText}
              fontWeight={600}
              className="product-name-primary"
              minWidth={0}
              flex={1}
            >
              {productName}
            </Typography>
            {showCategories && (
              <Typography
                color={theme.palette.text.secondary}
                className="product-name-primary"
                minWidth={0}
                flex={1}
                fontSize={14}
              >
                {product?.categories?.map((cat) => cat.name)?.join(' > ')}
              </Typography>
            )}
            <Typography
              color={theme.palette.text.secondary}
              className="product-name-primary"
              minWidth={0}
              flex={1}
              fontSize={14}
            >
              {spec}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default memo(ProductNameSimpleWithSpecUom);
