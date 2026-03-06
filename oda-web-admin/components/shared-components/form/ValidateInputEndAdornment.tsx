import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface IValidateInputEndAdornment {
  status: boolean;
  isLoading: boolean;
}

export const ValidateInputEndAdornment = (
  props: IValidateInputEndAdornment
) => {
  const { status, isLoading } = props;
  const theme = useTheme();

  if (status) {
    return (
      <CheckIcon sx={{ color: `${theme.palette.success.main} !important}` }} />
    );
  }
  if (isLoading) {
    return <CircularProgress thickness={7} size={25} color="success" />;
  }
  return null;
};
