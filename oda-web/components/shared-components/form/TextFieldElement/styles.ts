import { TextField, styled } from '@mui/material';

export const StyledTextField = styled(TextField)({
  '& input': {
    textOverflow: 'clip !important',
    overflow: 'visible',
  },
});
