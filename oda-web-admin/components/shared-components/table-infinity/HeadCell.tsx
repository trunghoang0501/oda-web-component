import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import { isEmpty } from 'rambda';
import { ErrorOutline } from '@mui/icons-material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useTheme } from '@mui/system';

export interface HeadCellItem {
  id: string;
  label: string;
  align: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  tooltip?: string;
  minWidth?: number;
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
}

const TypographyStyled = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.spacing(4),
  fontWeight: '700',
  display: 'block',
  width: '100%',
}));

export function HeadCell({ headCells }: HeadCellProps) {
  const theme = useTheme();
  if (!headCells || isEmpty(headCells)) {
    return <div />;
  }

  return (
    <>
      {headCells.map((headCell) => {
        let style: React.CSSProperties = { background: 'white' };
        if (headCell?.minWidth) {
          style = { ...style, minWidth: headCell.minWidth };
        }
        return (
          <TableCell key={headCell?.id} style={style}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={headCell?.align}
            >
              <TypographyStyled align={headCell?.align} noWrap>
                {headCell?.label}
              </TypographyStyled>
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
