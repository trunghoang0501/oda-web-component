import { Typography } from '@mui/material';
import * as React from 'react';
import { useTheme } from '@mui/system';
import { TypographyProps } from '@mui/material/Typography';
import { equals } from 'rambda';
import { memo } from 'react';

type IMainTitleProps = TypographyProps;

const MainTitle = ({ ...rest }: IMainTitleProps) => {
  const theme = useTheme();

  return (
    <Typography
      color="text.primary"
      gutterBottom
      fontSize={theme.spacing(8.5)}
      fontWeight={500}
      {...rest}
    />
  );
};

export default memo(MainTitle, equals);
