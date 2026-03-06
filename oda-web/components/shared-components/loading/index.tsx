import { Portal } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box, { BoxProps } from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

interface ILoading {
  label?: string;
  backdropColor?: string;
}

const WrapperLoading = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
  paddingLeft: theme.spacing(3.75),
  paddingRight: theme.spacing(3.75),
  borderRadius: theme.spacing(2),
}));

const LabelLoading = styled(Box)<BoxProps>(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: theme.spacing(6),
  fontWeight: 400,
  marginLeft: theme.spacing(2),
}));
const Loading = (props: ILoading) => {
  const { label, backdropColor = 'rgba(235, 233, 241, 0.5)' } = props;

  return (
    <Portal>
      <Backdrop
        sx={{
          background: backdropColor,
          zIndex: (theme) => theme.zIndex.drawer + 1300,
        }}
        open
      >
        <WrapperLoading>
          <CircularProgress color="primary" />
          {label && <LabelLoading>{` ${label}`}</LabelLoading>}
        </WrapperLoading>
      </Backdrop>
    </Portal>
  );
};

export default Loading;
