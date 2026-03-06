import { ViewList, ViewModule } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React from 'react';
import {
  ProductDisplayModeEnum,
  ProductViewStyleButtonProp,
} from '@/components/shared-components/product/props';
import { mediaMobileMax } from '@/utils/constants';

export const ProductViewTypeButton = ({
  type,
  onClick,
  inMenuBuy,
}: ProductViewStyleButtonProp) => {
  const theme = useTheme();
  const getButtonActiveColor = (mType: ProductDisplayModeEnum) => {
    const activeColor = inMenuBuy ? theme.palette.error.main : undefined;
    return mType === type ? activeColor : theme.palette.text.secondary;
  };
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          border: `1px solid${theme.palette.text.secondary}`,
          borderRadius: theme.spacing(1.5),
          [mediaMobileMax]: {
            display: 'none',
          },
        }}
      >
        <Button
          onClick={() => {
            onClick(ProductDisplayModeEnum.CARD);
          }}
          variant="text"
          sx={{
            borderColor: theme.palette.customColors.tableBorder,
            width: 40,
            height: 40,
            minWidth: 40,
            minHeight: 40,
          }}
        >
          <ViewModule
            sx={{
              fontSize: theme.spacing(7.5),
              color: getButtonActiveColor(ProductDisplayModeEnum.CARD),
            }}
          />
        </Button>
        <Button
          onClick={() => {
            onClick(ProductDisplayModeEnum.LIST);
          }}
          variant="text"
          sx={{
            borderColor: theme.palette.customColors.tableBorder,
            width: 40,
            height: 40,
            minWidth: 40,
            minHeight: 40,
          }}
        >
          <ViewList
            sx={{
              fontSize: theme.spacing(7.5),
              color: getButtonActiveColor(ProductDisplayModeEnum.LIST),
            }}
          />
        </Button>
      </Box>
      <Button
        onClick={() => {
          onClick(
            type === ProductDisplayModeEnum.CARD
              ? ProductDisplayModeEnum.LIST
              : ProductDisplayModeEnum.CARD
          );
        }}
        variant="outlined"
        sx={{
          borderColor: theme.palette.customColors.tableBorder,
          width: 40,
          height: 40,
          minWidth: 40,
          minHeight: 40,
          display: 'none',
          [mediaMobileMax]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        {type === ProductDisplayModeEnum.CARD && (
          <ViewModule
            sx={{
              fontSize: theme.spacing(6),
              color: inMenuBuy ? theme.palette.error.main : undefined,
            }}
          />
        )}
        {type === ProductDisplayModeEnum.LIST && (
          <ViewList
            sx={{
              fontSize: theme.spacing(6),
              color: inMenuBuy ? theme.palette.error.main : undefined,
            }}
          />
        )}
      </Button>
    </>
  );
};
