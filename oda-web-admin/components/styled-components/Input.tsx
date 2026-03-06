import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';

export const OutlinedInputSearchStyled = styled(OutlinedInput)(({ theme }) => ({
  height: theme.spacing(10),
  paddingLeft: 0,
  maxWidth: theme.spacing(125),
  width: '100%',
  '& .MuiOutlinedInput-input::placeholder': {
    color: theme.palette.text.secondary,
  },
  '& .MuiInputAdornment-root': {
    padding: theme.spacing(2, 0, 2, 3),
  },
}));

export const WrapperSelectPopupStyled = styled('div')(({ theme }) => ({
  display: 'block',
  width: '100%',
  '& .MuiFormControl-root': {
    display: 'block',
    width: '100%',
  },
  '& .MuiFormGroup-root': {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row',
  },
  '& .MuiFormLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.text.primary,
    },
  },
  '& .MuiFormControlLabel-root': {
    flex: '0 0 100%',
    maxWidth: '100%',
    marginBottom: theme.spacing(4),
    marginLeft: 0,
    marginRight: 0,
    '& .MuiCheckbox-root': {
      padding: 0,
    },
    '& .MuiFormControlLabel-label': {
      paddingLeft: theme.spacing(2.75),
    },
  },
  '&.flex-colunm-2': {
    '& .MuiFormControlLabel-root': {
      flex: '0 0 50%',
      maxWidth: '50%',
      marginBottom: 0,
    },
  },
  '& .MuiChip-root': {
    height: 'auto',
    '& .MuiChip-label': {
      lineHeight: theme.spacing(6),
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
      paddingTop: theme.spacing(0.75),
      paddingBottom: theme.spacing(0.75),
      fontWeight: '500',
      fontSize: theme.spacing(4),
    },
  },
  '.MuiInputBase-root': {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: theme.spacing(14),
  },
}));
