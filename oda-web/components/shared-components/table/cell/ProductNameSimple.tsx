import {
  Box,
  Stack,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { memo } from 'react';
import { ThumbnailType } from '@/components/shared-components/Image';
import { IProduct } from '@/types';
import { FONT_SEMI_BOLD, mediaMobileMax } from '@/utils/constants';

interface IProductNameSimpleProps {
  productName: string;
  sx?: SxProps<Theme>;
  extendData?: {
    productImage?: string;
    defaultImage?: string;
  };
  showCategories?: boolean;
  showSpec?: boolean;
  product?: IProduct;
  thumbnailType?: ThumbnailType | null;
}

const ProductNameSimple = (props: IProductNameSimpleProps) => {
  const {
    productName,
    extendData,
    sx,
    showCategories,
    product,
    showSpec = false,
    thumbnailType,
  } = props;
  const theme = useTheme();
  const mergedSx: SxProps<Theme> = {
    // py: 4,
    [mediaMobileMax]: {
      // fontSize: theme.spacing(3.5),
    },
    ...sx,
  };
  return (
    <Box sx={mergedSx}>
      <Stack direction="row" gap={2} alignItems="center">
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
              sx={{
                [mediaMobileMax]: {
                  whiteSpace: 'break-spaces',
                  wordBreak: 'break-all',
                  fontWeight: FONT_SEMI_BOLD,
                  fontSize: theme.spacing(4),
                },
              }}
            >
              {productName}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default memo(ProductNameSimple);
