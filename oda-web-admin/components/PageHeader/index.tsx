import { FC, ReactNode } from 'react';
import { Typography, Box } from '@mui/material';

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Typography variant="h5" component="h1">
        {title}
      </Typography>
      {actions && <Box>{actions}</Box>}
    </Box>
  );
};

export default PageHeader;
