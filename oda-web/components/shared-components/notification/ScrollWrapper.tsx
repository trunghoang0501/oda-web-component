import { Box, Theme, useMediaQuery } from '@mui/material';
import React, { ReactNode } from 'react';
import PerfectScrollbarComponent from 'react-perfect-scrollbar';

const ScrollWrapper = ({ children }: { children: ReactNode }) => {
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  if (hidden) {
    return (
      <Box
        sx={{
          '& .MuiMenuItem-root:last-of-type': {
            border: 0,
          },
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <PerfectScrollbarComponent
      options={{ wheelPropagation: false, suppressScrollX: true }}
    >
      {children}
    </PerfectScrollbarComponent>
  );
};

export default ScrollWrapper;
