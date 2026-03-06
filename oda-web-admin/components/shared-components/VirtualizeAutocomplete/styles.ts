import { hexToRGBA } from '@/utils';
import { styled } from '@mui/material';

export const AutocompleteWrapperStyled = styled('div')(({ theme }) => ({
  '& .MuiAutocomplete-root': {
    '& .MuiInputBase-formControl': {
      gap: theme.spacing(0.75),

      '& .MuiChip-root': {
        height: theme.spacing(5.5),
        padding: theme.spacing(1, 1, 1, 2.5),
        background: hexToRGBA(theme.palette.common.black, 0.08),
      },
      '& .MuiChip-label': {
        fontSize: theme.spacing(3),
        lineHeight: theme.spacing(4.5),
        paddingLeft: 0,
      },
      '& .MuiChip-deleteIcon': {
        margin: 0,
      },
      '.MuiAutocomplete-tagSizeMedium:not(.MuiChip-root)': {
        margin: theme.spacing(0, 0.75),
        lineHeight: theme.spacing(4),
      },
    },
  },
}));

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
