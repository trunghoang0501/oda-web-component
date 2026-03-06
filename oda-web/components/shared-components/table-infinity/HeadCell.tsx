import { ErrorOutline } from '@mui/icons-material';
import { Stack, TableSortLabel, useTheme } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { isEmpty } from 'rambda';
import React from 'react';
import { ColumnSortTypeEnum } from '@/constants';

export interface HeadCellItem {
  id: string;
  label: string;
  align: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  tooltip?: string;
  minWidth?: number;
  width?: number;
  isSortable?: boolean;
  field?: string;
}

const TableTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    '&:before': {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: theme.spacing(2.75),
    fontWeight: 500,
  },
}));

export interface HeadCellProps {
  headCells: HeadCellItem[];
  activeSortProperty?: string;
  onSort?: (cell: HeadCellItem) => void;
  columnSortType?: ColumnSortTypeEnum;
}

const TypographyStyled = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.spacing(4),
  fontWeight: '700',
  display: 'block',
  width: '100%',
}));

export function HeadCell({
  headCells,
  activeSortProperty,
  onSort,
  columnSortType,
}: HeadCellProps) {
  const theme = useTheme();
  if (!headCells || isEmpty(headCells)) {
    return <div />;
  }

  return (
    <>
      {headCells.map((headCell) => {
        let style: React.CSSProperties = { background: 'white' };
        if (headCell?.minWidth) {
          style = {
            ...style,
            minWidth: headCell.minWidth,
            width: headCell?.width,
          };
        }
        return (
          <TableCell key={headCell?.id} style={style}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={headCell?.align}
            >
              <TypographyStyled
                width="fit-content !important"
                align={headCell?.align}
                noWrap
              >
                {headCell?.label}
              </TypographyStyled>
              {headCell?.isSortable && (
                <TableSortLabel
                  active={activeSortProperty === headCell.id}
                  sx={{
                    width: theme.spacing(7),
                    height: theme.spacing(7),
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1.25,
                    '&:hover': {
                      backgroundColor: 'rgb(58, 53, 65, 0.04)',
                    },
                  }}
                  direction={columnSortType}
                  onClick={() => onSort?.(headCell)}
                />
              )}

              <TableTooltip placement="top" title={headCell?.tooltip ?? ''}>
                {headCell?.tooltip ? (
                  <ErrorOutline
                    sx={{ ml: theme.spacing(2) }}
                    fontSize="small"
                  />
                ) : (
                  <div />
                )}
              </TableTooltip>
            </Stack>
          </TableCell>
        );
      })}
    </>
  );
}
