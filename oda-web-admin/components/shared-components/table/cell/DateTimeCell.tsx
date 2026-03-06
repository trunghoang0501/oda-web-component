import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import { equals } from 'rambda';
import {
  formatDate,
  DATE_FORMAT_YYYY_MM_DD,
  DATE_FORMAT_HH_MM_SS,
} from '@/utils';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: theme.spacing(4),
  lineHeight: theme.spacing(6),
  color: theme.palette.customColors.tableText,
}));

interface DateTimeCellProps {
  date?: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

const DateTimeCell = ({ date, align }: DateTimeCellProps) => (
  <Box textAlign={align}>
    <TypographyStyled>
      {formatDate(date, DATE_FORMAT_YYYY_MM_DD)}
    </TypographyStyled>
    <TypographyStyled>
      {formatDate(date, DATE_FORMAT_HH_MM_SS)}
    </TypographyStyled>
  </Box>
);

export default React.memo(DateTimeCell, equals);
