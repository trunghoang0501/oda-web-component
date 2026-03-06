import { Box, Typography, styled } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { equals } from 'rambda';
import React from 'react';
import {
  DATE_FORMAT_HH_MM_SS,
  DATE_FORMAT_YYYY_MM_DD,
  formatDate,
} from '@/utils';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: theme.spacing(4),
  lineHeight: theme.spacing(6),
  color: theme.palette.customColors.tableText,
}));

const DateTimeCell = ({ row }: GridRenderCellParams<any, any>) => (
  <Box>
    <TypographyStyled>
      {formatDate(row.created_at, DATE_FORMAT_YYYY_MM_DD)}
    </TypographyStyled>
    <TypographyStyled>
      {formatDate(row.created_at, DATE_FORMAT_HH_MM_SS)}
    </TypographyStyled>
  </Box>
);

export default React.memo(DateTimeCell, equals);
