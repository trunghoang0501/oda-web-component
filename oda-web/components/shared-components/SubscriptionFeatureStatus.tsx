import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, BoxProps } from '@mui/material';

interface SubscriptionFeatureStatusProps {
  type: string;
  value: string | boolean;
  boxProps?: BoxProps;
}

/* 
  Use to show state of plan feature (unlimited, checked, N/A,...)
  Design: https://www.figma.com/file/0v0kRlUdgTTT5T00n7kQdz/oda-V1-Desktop-Design-Phase-2?node-id=2551%3A831348&t=h2KjISogjjv6ASJm-4
*/
const SubscriptionFeatureStatus = (props: SubscriptionFeatureStatusProps) => {
  const { type, value, boxProps } = props;

  const contentComponent = (() => {
    if (type === 'boolean') {
      if (value === true) {
        return <CheckIcon color="success" />;
      }

      return <CloseIcon color="error" />;
    }

    return <span>{value}</span>;
  })();

  return (
    <Box
      component="span"
      sx={{ display: 'inline-flex', alignItems: 'center' }}
      {...boxProps}
    >
      {contentComponent}
    </Box>
  );
};

export default SubscriptionFeatureStatus;
