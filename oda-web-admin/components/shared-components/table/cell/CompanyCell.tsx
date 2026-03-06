import React, { memo } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Image } from '@/components/shared-components/Image';
import { equals } from 'rambda';
import { IMAGE_DEFAULT } from '@/constants';

const ImageStyled = styled(Image)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  objectFit: 'cover',
  minWidth: theme.spacing(10),
  minHeight: theme.spacing(10),
}));

const NameTextStyled = styled(Typography)(({ theme }) => ({
  color: theme.palette.customColors.tableText,
  fontSize: theme.spacing(4),
  fontWeight: '600',
  noWrap: true,
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const ProvinceTextStyled = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.spacing(4),
  noWrap: true,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

interface CompanyCellProps {
  name?: string;
  province?: string;
  picture?: string;
}

const CompanyCellComponent = ({
  name,
  province,
  picture,
}: CompanyCellProps) => (
  <Stack direction="row" alignItems="center" overflow="hidden">
    <ImageStyled
      src={picture}
      defaultSrc={IMAGE_DEFAULT.COMPANY}
      alt={name}
      height={40}
      width={40}
    />
    <Box sx={{ ml: 2, width: '100%', minWidth: 0 }}>
      <NameTextStyled>{name}</NameTextStyled>
      <ProvinceTextStyled>{province}</ProvinceTextStyled>
    </Box>
  </Stack>
);

export const CompanyCell = memo(CompanyCellComponent, equals);
