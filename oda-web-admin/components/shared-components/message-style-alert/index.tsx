import * as React from 'react';
import { equals } from 'rambda';
import { useTheme } from '@mui/material/styles';
import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

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
    <Alert variant="outlined" sx={{ mb: theme.spacing(8) }} {...rest}>
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
