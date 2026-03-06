import { ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

export interface ITabPanelProps extends BoxProps {
  children: ReactNode;
  index: number;
  value: number;
  keepRenderContent?: boolean;
}

/**
 * Use this component to render content of tabs
 * Ref: https://mui.com/material-ui/react-tabs/#basic-tabs
 */
const TabPanel = (props: ITabPanelProps) => {
  const {
    children,
    value,
    index,
    keepRenderContent = false,
    ...restProps
  } = props;

  return (
    <Box role="tabpanel" hidden={value !== index} {...restProps}>
      {(value === index || keepRenderContent) && children}
    </Box>
  );
};

export default TabPanel;
