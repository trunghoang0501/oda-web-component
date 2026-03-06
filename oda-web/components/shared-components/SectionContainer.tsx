import { Box, BoxProps, useTheme } from '@mui/material';
import { hexToRGBA } from '@/utils';

interface ISectionContainer extends BoxProps {
  children: React.ReactNode;
}
export const SectionContainer = ({ children, ...rest }: ISectionContainer) => {
  const theme = useTheme();

  const initialSx = {
    p: 8,
    bgcolor: 'white',
    boxShadow: `0px 4px 24px 0px ${hexToRGBA(
      theme.palette.common.black,
      0.06
    )}`,
  };

  return (
    <Box {...initialSx} {...rest}>
      {children}
    </Box>
  );
};
