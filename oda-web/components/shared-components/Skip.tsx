import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { equals } from 'rambda';
import React, { memo, useCallback } from 'react';

interface ISkip {
  title?: string;
  onClickSkip?: () => void;
}

const Skip = ({ title, onClickSkip }: ISkip) => {
  const router = useRouter();

  const onClick = useCallback(
    () => (onClickSkip ? onClickSkip?.() : router.back()),
    [onClickSkip]
  );

  return (
    <Button
      onClick={onClick}
      sx={{ padding: 0, minHeight: 'auto', position: 'absolute', right: 0 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          textDecoration: 'underline',
          color: (theme) => theme.palette.text.primary,
        }}
      >
        {!!title && <Typography>{title}</Typography>}
      </Stack>
    </Button>
  );
};

export default memo(Skip, equals);
