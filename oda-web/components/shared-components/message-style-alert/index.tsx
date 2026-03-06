import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useTheme } from '@mui/material/styles';
import { equals } from 'rambda';
import * as React from 'react';
import { mediaMobileMax } from '@/utils/constants';

interface IMessageAlertProps extends AlertProps {
  title: string;
  content: string;
}

const MessageAlert = (props: IMessageAlertProps) => {
  // Hooks
  const theme = useTheme();
  // Props
  const { title, content, ...rest } = props;

  return (
    <Alert
      variant="outlined"
      sx={{
        mb: theme.spacing(8),
        [mediaMobileMax]: {
          pt: `${theme.spacing(1)}`,
        },
      }}
      {...rest}
    >
      <AlertTitle
        className="MuiDialogContent-title"
        sx={{
          fontSize: `${theme.spacing(4)} !important`,
          pt: `${theme.spacing(0)} !important`,
        }}
      >
        {title}
      </AlertTitle>
      {content}
    </Alert>
  );
};

export default React.memo(MessageAlert, equals);
