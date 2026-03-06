import { Box, BoxProps, useTheme } from '@mui/material';
import React from 'react';
import { SubscriptionStatusEnum } from '@/constants';
import { IStatus } from '@/types';

interface SubscriptionStatusTextProps {
  status: IStatus;
  BoxProps?: BoxProps; // ! NOTE: need confirm from lead for naming prop convetion
}

/**
 * This component to show subscription plan status text color corresponding to status id
 */
function SubscriptionStatusText(props: SubscriptionStatusTextProps) {
  const { BoxProps: boxComponentProps, status } = props;
  const theme = useTheme();

  const textColor = (() => {
    switch (status.id) {
      case SubscriptionStatusEnum.Waiting:
        return theme.palette.primary.dark;
      case SubscriptionStatusEnum.Active:
        return theme.palette.success.dark;
      default:
        return theme.palette.error.dark;
    }
  })();

  return (
    <Box
      component="span"
      color={textColor}
      className="subscriptionStatusText"
      {...boxComponentProps}
    >
      {status?.name}
    </Box>
  );
}

export default SubscriptionStatusText;
