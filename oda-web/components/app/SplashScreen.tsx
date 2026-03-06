import { Box, useTheme } from '@mui/material';
import { PUBLIC_IMAGES_URL } from '@/constants';

export const SplashScreen = () => {
  const theme = useTheme();

  return (
    <Box
      className="splashScreen"
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: theme.spacing(60),
          height: theme.spacing(40),
          lineHeight: theme.spacing(1),
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            '@keyframes logo': {
              // jump effect
              '0%': { transform: `translateY(0%)` },
              '50%': { transform: `translateY(-13%)` },
              '100%': { transform: `translateY(0)` },
            },
            position: 'relative',
            zIndex: 2,
            '.logo-img': {
              width: theme.spacing(60),
              height: theme.spacing(40),
              animation: `logo 2s ease infinite`,
            },
          }}
        >
          <img
            className="logo-img"
            src={`${PUBLIC_IMAGES_URL}/logo/logo.svg`}
            alt=""
          />
        </Box>
      </Box>
    </Box>
  );
};
