import { Typography, TypographyProps, styled } from '@mui/material';

export const TypographyEllipsis = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'line',
})<
  TypographyProps & {
    line: number;
  }
>(({ line }) => ({
  display: '-webkit-box',
  WebkitLineClamp: line,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'normal',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
