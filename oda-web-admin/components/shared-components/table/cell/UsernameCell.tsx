import React, { memo } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Image } from '@/components/shared-components/Image';
import { equals } from 'rambda';
import { useTheme } from '@mui/system';
import { IMAGE_DEFAULT } from '@/constants';

const TextStyled = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.customColors.tableText,
  fontSize: theme.spacing(4),
  fontWeight: '600',
  noWrap: true,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

interface UsernameCellProps {
  fullName?: string;
  username?: string;
  picture?: string;
}

const UsernameCellComponent = ({
  fullName,
  username,
  picture,
}: UsernameCellProps) => {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center" overflow="hidden">
      <Image
        src={picture}
        defaultSrc={IMAGE_DEFAULT.USER}
        alt={fullName}
        height={40}
        width={40}
        style={{
          objectFit: 'cover',
          borderRadius: '50%',
          minWidth: theme.spacing(10),
          minHeight: theme.spacing(10),
        }}
      />
      <Box sx={{ ml: 2, width: '100%', minWidth: 0 }}>
        <TextStyled>{fullName}</TextStyled>
        <TextStyled>{username}</TextStyled>
      </Box>
    </Stack>
  );
};

export const UsernameCell = memo(UsernameCellComponent, equals);
