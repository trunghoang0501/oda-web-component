import Avatar from '@mui/material/Avatar';
import Box, { BoxProps } from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import React from 'react';
import { IOption } from '@/types';
import { IMAGE_DEFAULT } from '@/utils/constants';

const BoxListBuyerStyled = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: theme.spacing(2),
  rowGap: theme.spacing(4),
  '& .MuiChip-root': {
    padding: theme.spacing(2, 4),
    minHeight: theme.spacing(10),
    borderRadius: theme.spacing(5),
    background: 'transparent',
    border: `1px solid ${theme.palette.text.secondary}`,
    fontSize: theme.spacing(4),
    lineHeight: theme.spacing(6),
    '& .MuiChip-avatar': {
      margin: 0,
      borderRadius: theme.spacing(1),
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.text.secondary,
      width: theme.spacing(5),
      height: theme.spacing(5),
      margin: 0,
    },
    '& .MuiChip-label': {
      paddingLeft: theme.spacing(2),
      fontWeight: 500,
    },
  },
}));

const ListItemStyled = styled('li')(() => ({
  display: 'inline-block',
}));

export function BuyerTagList({
  tags,
  handleDeleteBuyer,
}: {
  tags?: IOption[];
  handleDeleteBuyer?: (chipToDelete: IOption) => () => void;
}) {
  return (
    <BoxListBuyerStyled>
      {(tags ?? [])?.map((data) => {
        const icon = data?.img ?? IMAGE_DEFAULT.COMPANY;

        return (
          <ListItemStyled key={data?.value}>
            <Chip
              avatar={<Avatar alt={data?.label} src={icon} />}
              label={data?.label ?? ''}
              onDelete={handleDeleteBuyer?.(data)}
            />
          </ListItemStyled>
        );
      })}
    </BoxListBuyerStyled>
  );
}
