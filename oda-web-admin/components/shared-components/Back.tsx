import React, { memo, useCallback } from 'react';
import { equals } from 'rambda';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const TitleStyled = styled(Typography)(({ theme }) => ({
  fontSize: theme.spacing(4.5),
  fontWeight: 500,

  '&.sm': {
    fontSize: theme.spacing(4),
    fontWeight: 400,
  },
}));

interface IBack {
  title?: string;
  onClickBack?: () => void;
  size?: 'sm';
}

const Back = ({ title, onClickBack, size }: IBack) => {
  const onClick = useCallback(
    () => onClickBack && onClickBack?.(),
    [onClickBack]
  );

  const theme = useTheme();

  return (
    <Button className="btnBack" onClick={onClick} sx={{ padding: 0 }}>
      <Stack direction="row" alignItems="center">
        <ArrowBackIosIcon sx={{ color: theme.palette.text.primary }} />
        {!!title && (
          <TitleStyled className={size === 'sm' ? 'sm' : ''}>
            {title}
          </TitleStyled>
        )}
      </Stack>
    </Button>
  );
};

export default memo(Back, equals);
