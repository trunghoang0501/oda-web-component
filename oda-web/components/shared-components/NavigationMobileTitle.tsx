import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { mediaMobileMax } from '@/utils/constants';

export interface NavigationMobileTitleProps {
  title: string;
  boolBreakByWord?: boolean;
  onBack?: () => void;
}

export const NavigationMobileTitle = ({
  title,
  boolBreakByWord = false,
  onBack,
}: NavigationMobileTitleProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box
      className="mobileNavTitle"
      sx={{
        display: 'none',
        [mediaMobileMax]: {
          position: 'absolute',
          top: 0,
          height: theme.spacing(16),
          left: theme.spacing(11),
          backgroundColor: 'white',
          textTransform: 'capitalize',
          width: `calc(100vw - ${theme.spacing(62.5)})`,
          pl: 2,
          fontSize: theme.spacing(4.5),
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'break-spaces',
          wordBreak: boolBreakByWord ? 'break-word' : 'break-all',
          cursor: onBack ? 'pointer' : 'default',
        },
      }}
      onClick={onBack}
    >
      {t(title)}
    </Box>
  );
};
