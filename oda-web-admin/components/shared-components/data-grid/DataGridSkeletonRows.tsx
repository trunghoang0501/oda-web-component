import { hexToRGBA } from '@/utils';
import { Box, Skeleton, useTheme } from '@mui/material';

interface IDataGridSkeletonRowsProps {
  rows?: number;
  columns?: number;
}

const DataGridSkeletonRows = (props: IDataGridSkeletonRowsProps) => {
  const { rows = 10, columns = 6 } = props;
  const theme = useTheme();

  return (
    <Box sx={{}}>
      {new Array(rows).fill(0).map((item, idx) => {
        return (
          <Box
            key={idx}
            sx={{
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              py: 2,
              px: 2,
              gap: 4,
              borderBottom: `1px solid ${hexToRGBA(
                theme.palette.common.black,
                0.12
              )}`,
            }}
          >
            {new Array(columns).fill(0).map((item2, idx2) => {
              return (
                <Box key={idx2}>
                  <Skeleton />
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default DataGridSkeletonRows;
