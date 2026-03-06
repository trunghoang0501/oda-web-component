import { Box, Divider, Skeleton, Stack } from '@mui/material';
import { GridColumns, GridValidRowModel } from '@mui/x-data-grid';
import { range } from 'rambda';
import { Fragment } from 'react';

interface IListEmptyCellProps {
  listColumn: GridColumns<GridValidRowModel>;
}

export const ListEmptyCell = ({ listColumn }: IListEmptyCellProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: (theme) => theme.spacing(104),
      }}
    >
      <Box>
        {range(0, 10).map((_, index) => {
          return (
            <Fragment key={index?.toString()}>
              <Stack
                direction="row"
                key={index?.toString()}
                mt={index === 0 ? 1.5 : 0}
                ml={2}
              >
                {listColumn.map((cell, inx) => {
                  return (
                    <Box
                      key={inx?.toString()}
                      sx={{
                        justifyContent: cell.align,
                        display: 'flex',
                        flex: cell.flex,
                        minWidth: cell.minWidth,
                        width: cell.width,
                      }}
                    >
                      <Skeleton sx={{ width: '50%' }} />
                    </Box>
                  );
                })}
              </Stack>
              {index !== 10 && <Divider />}
            </Fragment>
          );
        })}
      </Box>
    </Box>
  );
};
