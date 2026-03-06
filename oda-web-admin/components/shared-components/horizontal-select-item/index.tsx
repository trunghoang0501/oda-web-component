import { Box, BoxProps, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Image } from '@/components/shared-components/Image';
import React from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/system';
import { IMAGE_DEFAULT } from '@/constants';
import { HorizontalSelectItemProps } from './HorizontalSelectItem';

const ImageStyled = styled(Image)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  minWidth: theme.spacing(10),
  minHeight: theme.spacing(10),
}));

// Styled Item
const BoxItemStyled = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(2, 0),
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    cursor: 'pointer',
  },
  '&:focus': {
    cursor: 'pointer',
  },
  '& >.MuiTypography-root': {
    fontWeight: 500,
    fontSize: theme.spacing(4),
    minWidth: theme.spacing(75),
    marginRight: theme.spacing(6),
  },
}));

// Styled button
const ButtonArrowRightStyled = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  width: theme.spacing(12),
  height: theme.spacing(12),
}));

const HorizontalSelectItem = ({
  icon,
  label,
  value,
  onClick,
  valuePlaceholder,
  rightComponent,
  disable,
  img,
  sx,
}: HorizontalSelectItemProps) => {
  const theme = useTheme();
  return (
    <BoxItemStyled
      onClick={onClick}
      sx={[
        !onClick ? { py: theme.spacing(5) } : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="body1"
        color={!!disable && theme.palette.text.secondary}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {icon}
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: (!value && theme.palette.text.secondary) || undefined,
          whiteSpace: 'pre-wrap',
          display: 'flex',
          alignItems: 'center',
          wordBreak: 'break-word',
        }}
      >
        {img && (
          <ImageStyled
            src={img}
            defaultSrc={IMAGE_DEFAULT.COMPANY}
            alt="picture"
            height={40}
            width={40}
            sx={{ objectFit: 'cover', mr: 2.5 }}
          />
        )}
        {value || valuePlaceholder}
      </Typography>
      <Box sx={{ ml: 'auto', display: 'flex' }}>
        {!!rightComponent && rightComponent?.()}
        {!!onClick && (
          <ButtonArrowRightStyled>
            <KeyboardArrowRightIcon
              color={(!!disable && 'disabled') || 'secondary'}
            />
          </ButtonArrowRightStyled>
        )}
      </Box>
    </BoxItemStyled>
  );
};

export default HorizontalSelectItem;
