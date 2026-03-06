import { Box } from '@mui/system';
import React from 'react';
import useFitText from 'use-fit-text';

export const AutoResizeFontView = ({
  value,
  maxHeight,
  textAlign,
}: {
  value: string;
  maxHeight: number | string;
  textAlign: 'flex-end' | 'center' | 'flex-start';
}) => {
  const { fontSize, ref } = useFitText();
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <div
        ref={ref}
        style={{
          fontSize,
          height: 'unset',
          maxHeight,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: textAlign,
        }}
      >
        {value}
      </div>
    </Box>
  );
};
