import { Typography, TypographyProps, styled } from '@mui/material';

export const TypographyEllipsis = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'line',
})<
  TypographyProps & {
    line: string;
  }
>(({ line }) => ({
  display: '-webkit-box',
  WebkitLineClamp: line,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'normal',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
