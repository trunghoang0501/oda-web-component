import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  styled,
} from '@mui/material';
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar';
import MuiMenu, { MenuProps } from '@mui/material/Menu';
import { mediaMobileMax } from '@/utils/constants';

export const MenuStyled = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  height: '100%',
  '& .MuiMenu-paper': {
    width: theme.spacing(152.5),
    maxWidth: '100vw',
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [mediaMobileMax]: {
      position: 'fixed',
      top: `${theme.spacing(13)} !important`,
      left: '0 !important',
      right: 0,
      bottom: 0,
    },
  },
  '& .MuiMenu-list': {
    padding: 0,
    maxHeight: theme.spacing(161.5),
    [mediaMobileMax]: {
      maxHeight: `calc(100vh - ${theme.spacing(37.5)})`,
    },
    display: 'flex',
    flexDirection: 'column',
  },
  '& .scrollbar-container': {
    height: 'auto',
  },
  '& .MuiBox-root:last-of-type': {
    border: 0,
  },
}));

export const MenuItemStyled = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(2.75, 4),
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
}));

export const AvatarStyled = styled(MuiAvatar)<AvatarProps>(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
}));

export const MenuItemTitleStyled = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontWeight: 600,
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.customColors.tableText,
  })
);

export const MenuItemSubtitleStyled = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.text.secondary,
    a: {
      color: theme.palette.customColors.colorCyan,
    },
  })
);

export const DotStyled = styled(Box)(({ theme }) => ({
  background: theme.palette.error.main,
  width: theme.spacing(2),
  height: theme.spacing(2),
  position: 'absolute',
  borderRadius: '50%',
  top: theme.spacing(2.25),
  right: theme.spacing(2.25),
}));
