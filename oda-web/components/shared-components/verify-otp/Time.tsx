// ** React Imports ** Next Imports ** Imports Configs ** Icons Imports ** MUI Components ** Layout Import
// ** React Imports
// ** MUI Components
import { Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectTime } from '@/store/slices/otp';
import { secondToTime } from '@/utils';

const TimeOtpContainer = styled('div')(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const TimeOtp = () => {
  const time = useSelector(selectTime);
  const formatTime = secondToTime(time ?? 0);
  const theme = useTheme();
  return (
    <TimeOtpContainer>
      <Typography
        sx={{
          m: 0,
          color:
            formatTime === '00:00'
              ? theme.palette.error.light
              : theme.palette.text.primary,
        }}
        variant="body1"
        gutterBottom
      >
        {formatTime}
      </Typography>
    </TimeOtpContainer>
  );
};

export default TimeOtp;
