import { Box, Typography } from '@mui/material';
import { mediaMobileMax } from '@/utils/constants';

interface IEmptyViewProps {
  content: string;
}

const EmptyView = ({ content }: IEmptyViewProps) => {
  return (
    <Box
      flex={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <Typography
        sx={{
          [mediaMobileMax]: {
            fontSize: (theme) => theme.spacing(3.5),
            textAlign: 'center',
          },
        }}
        fontWeight="600"
        color="secondary"
      >
        {content}
      </Typography>
    </Box>
  );
};

export default EmptyView;
