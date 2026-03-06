import { styled } from '@mui/material';

export const BoxListStyled = styled('div')(({ theme }) => ({
  maxHeight: '40vh',
  overflow: 'auto',

  '[data-viewport-type="element"]': {
    padding: `${theme.spacing(2, 0)} !important`,
    position: 'unset !important',
  },

  '.MuiAutocomplete-listbox': {
    padding: 0,
  },
}));
