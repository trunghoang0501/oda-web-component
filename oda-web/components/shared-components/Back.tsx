import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { equals } from 'rambda';
import React, { memo, useCallback } from 'react';
import { mediaMobileMax } from '@/utils/constants';

interface IBack {
  title?: string;
  onClickBack?: () => void;
  mobileTop?: string;
}

const Back = ({ title, onClickBack, mobileTop }: IBack) => {
  const router = useRouter();

  const onClick = useCallback(
    () => (onClickBack ? onClickBack?.() : router.back()),
    [onClickBack]
  );
  const theme = useTheme();
  return (
    <Box
      className="mobileNavTitle"
      sx={{
        [mediaMobileMax]: {
          display: 'block',
          position: 'absolute',
          top: mobileTop ?? theme.spacing(4.75),
          left: theme.spacing(4),
          backgroundColor: 'white',
          fontSize: theme.spacing(3.5),
        },
      }}
    >
      <Button onClick={onClick} sx={{ padding: 0, minHeight: 'auto' }}>
        <Stack direction="row" alignItems="center">
          <ArrowBackIosIcon color="secondary" />
          {!!title && <Typography>{title}</Typography>}
        </Stack>
      </Button>
    </Box>
  );
};

export default memo(Back, equals);
