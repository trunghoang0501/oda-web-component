import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

export interface ITabPanelProps extends BoxProps {
  children: ReactNode;
  wrapperRef?: BoxProps['ref'];
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
    wrapperRef,
    value,
    index,
    keepRenderContent = false,
    ...restProps
  } = props;

  return (
    <Box
      ref={wrapperRef}
      role="tabpanel"
      hidden={value !== index}
      {...restProps}
    >
      {(value === index || keepRenderContent) && children}
    </Box>
  );
};

export default TabPanel;
