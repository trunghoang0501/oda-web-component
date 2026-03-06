import { Box, BoxProps, Typography } from '@mui/material';
import { TypeAction } from '@/types';
import { VerifiedEnum } from '@/constants';
import { Image } from '@/components/shared-components/Image';
import React, { ReactElement, ReactNode, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/system';
import ListActionsButton from './ListActionsButton';

export interface HorizontalSelectItemProps {
  /**
   * icon label
   * @default undefined
   */
  icon?: string | string[] | ReactNode;
  /**
   * Left label
   * @default undefined
   */
  label: string;
  /**
   * middle label
   * @default undefined
   */
  value?: string;
  /**
   * placeholder of middle label
   * @default undefined
   */
  valuePlaceholder?: string;
  /**
   * placeholder of middle label
   * @default undefined
   */
  onClick?: (type?: TypeAction) => void;
  /**
   * placeholder of middle label
   * @default undefined
   */
  rightComponent?: () => ReactElement;
  /**
   * if `disable` is true, user can't click on item
   * @default false
   */
  disable?: boolean;
  /**
   * Img by value Horizontal
   * @default undefined
   */
  img?: string;
  /**
   * verified by value Horizontal
   * @default undefined
   */
  verified?: VerifiedEnum;
}

const ImageStyled = styled(Image)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  minWidth: theme.spacing(10),
  minHeight: theme.spacing(10),
}));

// Styled Item
const BoxItemStyled = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(2, 0),
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    cursor: 'pointer',
  },
  '&:focus': {
    cursor: 'pointer',
  },
  '& >.MuiTypography-root': {
    fontWeight: 500,
    fontSize: theme.spacing(4),
    minWidth: theme.spacing(75),
    marginRight: theme.spacing(6),
  },
}));

// Styled button
const ButtonArrowRightStyled = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  height: theme.spacing(12),
}));

const HorizontalSelectItemCustom = ({
  icon,
  label,
  value,
  onClick,
  valuePlaceholder,
  rightComponent,
  disable,
  img,
  verified,
}: HorizontalSelectItemProps) => {
  const theme = useTheme();

  const showApproveAndRejectButton = useMemo(() => {
    if (verified === VerifiedEnum.Unverified) {
      return !!value;
    }

    return false;
  }, [value, verified]);

  return (
    <BoxItemStyled sx={!onClick ? { padding: theme.spacing(5, 0) } : {}}>
      <Typography
        variant="body1"
        color={!!disable && theme.palette.text.secondary}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {icon}
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: (!value && theme.palette.text.secondary) || undefined,
          whiteSpace: 'pre-wrap',
          display: 'flex',
          alignItems: 'center',
          wordBreak: 'break-word',
        }}
      >
        {img && (
          <ImageStyled
            src={img}
            defaultSrc="/images/avatar_default.svg"
            alt="picture"
            height={40}
            width={40}
            sx={{ objectFit: 'cover', mr: 2.5 }}
          />
        )}
        {value || valuePlaceholder}
      </Typography>
      <Box sx={{ ml: 'auto', display: 'flex' }}>
        {!!rightComponent && rightComponent?.()}
        {!!onClick && (
          <ButtonArrowRightStyled>
            <ListActionsButton
              onClick={onClick}
              showEditButton
              showApproveButton={showApproveAndRejectButton}
              showRejectButton={showApproveAndRejectButton}
            />
          </ButtonArrowRightStyled>
        )}
      </Box>
    </BoxItemStyled>
  );
};

export default HorizontalSelectItemCustom;
