import { Box, BoxProps, Typography, styled } from '@mui/material';

export const NoResultTextStyled = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  color: theme.palette.text.secondary,
  fontWeight: 600,
}));

export const FilterLabelStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: theme.spacing(6),
}));
