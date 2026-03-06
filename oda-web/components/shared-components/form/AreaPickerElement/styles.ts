import {
  Box,
  BoxProps,
  List,
  ListProps,
  TextField,
  TextFieldProps,
  styled,
} from '@mui/material';
import { hexToRGBA } from '@/utils';

export const AreaPickerStyled = styled(List)<ListProps>(({ theme }) => ({
  width: '100%',
  backgroundColor: 'background.paper',
  position: 'relative',
  padding: 0,
  height: '100%',
  overflowX: 'auto',
  maxWidth: '100%',
  '& ul': { padding: 0 },
  '& .MuiListItem-root': {
    '&.active': {
      background: hexToRGBA(theme.palette.customColors.magnolia, 0.8),
      '& .MuiTypography-root': {
        fontWeight: 500,
        color: theme.palette.success.main,
      },
    },
  },
}));

export const BoxPopperStyled = styled(Box)<BoxProps>(({ theme }) => ({
  width: theme.spacing(130),
  height: theme.spacing(62),
  backgroundColor: theme.palette.background.paper,
  boxShadow: `0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)`,
  borderRadius: theme.spacing(1),
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(2),
  overflow: 'hidden',
  '& .MuiTabs-root': {
    minHeight: theme.spacing(10.5),
  },
  '& .MuiTab-root': {
    flex: '50% 0',
    height: theme.spacing(10),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: theme.spacing(10),
  },
  '& .MuiTabs-scroller': {
    height: theme.spacing(10.5),
    borderBottom: `1px solid ${hexToRGBA(theme.palette.common.black, 0.12)}`,
  },
}));

export const TextFieldStyled = styled(TextField)<TextFieldProps>(
  ({ theme }) => ({
    width: '100%',
    maxWidth: theme.spacing(130),

    '.address': {
      display: 'flex',
      whiteSpace: 'nowrap',
      gap: theme.spacing(2),
      paddingLeft: theme.spacing(4),
      '.city, .district': {
        whiteSpace: 'nowrap',
      },
    },
  })
);

export const BoxClickAwayListenerStyled = styled(Box)<BoxProps>(
  ({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    maxWidth: theme.spacing(130),
  })
);
