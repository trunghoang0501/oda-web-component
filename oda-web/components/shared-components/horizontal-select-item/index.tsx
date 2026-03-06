import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, BoxProps, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { mediaMobileMax } from '@/utils/constants';
import { HorizontalSelectItemProps } from './HorizontalSelectItem';

// Styled Item
const BoxItemStyled = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(2, 8),
  display: 'flex',
  alignItems: 'center',
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
  middleComponent,
}: HorizontalSelectItemProps) => {
  const theme = useTheme();
  return (
    <BoxItemStyled
      onClick={onClick}
      sx={{
        ...(!onClick && { p: theme.spacing(5, 8) }),
        cursor: onClick ? 'pointer' : 'default',
        [mediaMobileMax]: {
          py: 2,
          px: 0,
        },
      }}
    >
      <Typography
        variant="body1"
        color={disable ? theme.palette.text.secondary : undefined}
        sx={{
          display: 'flex',
          alignItems: 'center',
          [mediaMobileMax]: {
            display: 'none',
          },
        }}
      >
        {icon}
        {label}
      </Typography>
      <Box
        sx={{
          [mediaMobileMax]: {
            display: 'none',
          },
        }}
      >
        {middleComponent ? (
          middleComponent?.()
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: !value
                ? theme.palette.text.secondary
                : theme.palette.text.primary,
              overflow: 'hidden',
              whiteSpace: 'no-wrap',
              textOverflow: 'ellipsis',
            }}
          >
            {value || valuePlaceholder}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          display: 'none',
          [mediaMobileMax]: {
            display: 'block',
          },
        }}
      >
        <Typography
          variant="body1"
          color={
            disable ? theme.palette.text.secondary : theme.palette.text.primary
          }
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: theme.spacing(3.5),
          }}
        >
          {icon}
          {label}
        </Typography>
        {middleComponent ? (
          middleComponent?.()
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: !value
                ? theme.palette.text.secondary
                : theme.palette.text.primary,
              overflow: 'hidden',
              whiteSpace: 'no-wrap',
              textOverflow: 'ellipsis',
              fontSize: theme.spacing(3.5),
            }}
          >
            {value || valuePlaceholder}
          </Typography>
        )}
      </Box>
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
