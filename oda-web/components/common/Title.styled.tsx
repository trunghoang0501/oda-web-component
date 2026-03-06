import { Box, Typography, useTheme } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography';
import { equals } from 'rambda';
import * as React from 'react';
import { memo } from 'react';

type IMainTitleProps = TypographyProps;

const MainTitle = ({ ...rest }: IMainTitleProps) => {
  const theme = useTheme();
  return (
    <Box className="mainTitle">
      <Typography
        color="text.primary"
        gutterBottom
        fontSize={theme.spacing(8)}
        fontWeight={500}
        {...rest}
      />
    </Box>
  );
};

export default memo(MainTitle, equals);
