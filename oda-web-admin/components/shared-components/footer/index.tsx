// ** React Imports
import React, { ReactNode } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ** Type Import
import { Settings } from '@/context/settingsContext';

// ** Footer Content Component
import FooterContent from './FooterContent';

interface Props {
  settings: Settings;
  footerContent?: (props?: any) => ReactNode;
}

const Footer = (props: Props) => {
  // ** Props
  const { settings, footerContent: userFooterContent } = props;

  // ** Hook
  const theme = useTheme();

  // ** Vars
  const { contentWidth } = settings;

  return (
    <Box
      className="layout-footer"
      sx={{
        width: '100%',
        padding: theme.spacing(4),
        ...(contentWidth === 'boxed' && {
          '@media (min-width:1440px)': { maxWidth: 1440 },
        }),
      }}
    >
      {userFooterContent ? userFooterContent(props) : <FooterContent />}
    </Box>
  );
};

export default Footer;
