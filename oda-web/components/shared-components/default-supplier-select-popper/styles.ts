import { Box, Popper, styled } from '@mui/material';

export const BoxContainerStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  width: theme.spacing(135.5),
  maxHeight: '40vh',
  overflow: 'auto',

  '[data-viewport-type="element"]': {
    padding: `${theme.spacing(0, 0, 2, 0)} !important`,
    position: 'unset !important',

    '[data-test-id="virtuoso-item-list"]': {
      display: 'flex',
      flexDirection: 'column',
    },
  },

  '.MuiAutocomplete-listbox': {
    padding: 0,
  },
}));

export const PopperStyled = styled(Popper)(({ theme }) => ({
  zIndex: 9999,
  background: theme.palette.common.white,
  boxShadow:
    '0px 2px 2px -3px rgba(58, 53, 65, 0.1),0px 2px 3px 1px rgba(58, 53, 65, 0.1),0px 3px 2px 2px rgba(58, 53, 65, 0.1)',
}));
