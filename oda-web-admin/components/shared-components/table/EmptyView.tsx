import { Box, Typography } from '@mui/material';

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
      <Typography fontWeight="600" color="secondary">
        {content}
      </Typography>
    </Box>
  );
};

export const emptyViewFunc = (content: string) => (
  <EmptyView content={content} />
);

export default EmptyView;
