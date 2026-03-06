import { Autocomplete, styled } from '@mui/material';

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiAutocomplete-popupIndicator': {
    display: 'none',
  },
}));
