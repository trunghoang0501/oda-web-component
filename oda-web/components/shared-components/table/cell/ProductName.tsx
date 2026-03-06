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
import useMobileDetect from '@/hooks/useMobileDetect';
import { TLanguages } from '@/types';
import { mediaMobileMax } from '@/utils/constants';

interface IProductNameProps {
  primaryLanguage: TLanguages;
  secondaryLanguage: TLanguages | null;
  productName: string;
  productNameSecondary?: string;
  sx?: SxProps<Theme>;
  onlyViLanguage?: boolean;
  extendData?: {
    productImage?: string;
  };
  thumbnailType?: ThumbnailType | null;
  imageSize?: number; // Custom image size in pixels (default: 40)
}

const Flag = ({ language }: { language: TLanguages }) => {
  return (
    <img
      src={`/country/${language}.svg`}
      width={24}
      height={16}
      alt={language}
    />
  );
};

const ProductName = (props: IProductNameProps) => {
  const {
    primaryLanguage,
    secondaryLanguage,
    productName,
    productNameSecondary,
    extendData,
    sx,
    onlyViLanguage,
    thumbnailType,
    imageSize = 40,
  } = props;

  const mergedSx: SxProps<Theme> = {
    py: 4,
    ...sx,
  };

  const theme = useTheme();
  const hasSecondaryLanguage = !!secondaryLanguage;
  const currentDevice = useMobileDetect();
  const isMobile = currentDevice.isMobile();
  return (
    <Box sx={mergedSx}>
      <Stack direction="row" gap={2} alignItems="center">
        {extendData?.productImage && (
          <Box
            width={theme.spacing(imageSize / 4)}
            height={theme.spacing(imageSize / 4)}
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
              thumbnailType={
                thumbnailType ??
                (imageSize >= 72
                  ? ThumbnailType.SMALL_80
                  : ThumbnailType.SMALL_40)
              }
              src={extendData.productImage}
              className="product-img"
              alt=""
              width={imageSize}
              height={imageSize}
              style={{
                objectFit: 'cover',
              }}
            />
          </Box>
        )}
        <Stack flex={1} gap={hasSecondaryLanguage ? 1 : 0}>
          <Stack
            direction="row"
            gap={1}
            alignItems={isMobile ? 'center' : 'center'}
            minWidth={theme.spacing(6)}
          >
            {hasSecondaryLanguage && (
              <Box
                sx={{
                  width: theme.spacing(6),
                  lineHeight: theme.spacing(1),
                  '& img': {
                    display: 'block',
                  },
                }}
              >
                <Flag language={primaryLanguage} />
              </Box>
            )}

            <Typography
              color={theme.palette.customColors.tableText}
              fontWeight={600}
              className="product-name-primary"
              minWidth={0}
              flex={1}
              sx={{
                [mediaMobileMax]: {
                  fontSize: theme.spacing(3.5),
                },
              }}
            >
              {productName}
            </Typography>
          </Stack>

          {hasSecondaryLanguage && !onlyViLanguage && (
            <Stack direction="row" gap={1} alignItems="center">
              <Box
                sx={{
                  width: theme.spacing(6),
                  lineHeight: theme.spacing(1),
                  '& img': {
                    display: 'block',
                  },
                }}
              >
                <Flag language={secondaryLanguage} />
              </Box>
              <Typography
                color={theme.palette.customColors.tableText}
                fontWeight={600}
                className="product-name-secondary"
                minWidth={0}
                flex={1}
                sx={{
                  [mediaMobileMax]: {
                    fontSize: theme.spacing(3.5),
                  },
                }}
              >
                {productNameSecondary || '-'}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default memo(ProductName);
