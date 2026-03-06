import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';

interface IValidateInputEndAdornment {
  status: boolean;
  isLoading: boolean;
}

export const ValidateInputEndAdornment = (
  props: IValidateInputEndAdornment
) => {
  const { status, isLoading } = props;
  if (status) {
    return <CheckIcon color="primary" />;
  }
  if (isLoading) {
    return <CircularProgress thickness={7} size={25} color="primary" />;
  }
  return null;
};
