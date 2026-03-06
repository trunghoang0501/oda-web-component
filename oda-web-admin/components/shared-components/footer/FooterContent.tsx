// React Imports
import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NextLink from '@/components/shared-components/NextLink';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  '& .MuiTypography-root': {
    lineHeight: theme.spacing(5.5),
  },
}));

const FooterContent = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid
          item
          xs="auto"
          sx={{
            mx: 'auto',
            pl: '0 !important',
            pr: theme.spacing(1),
          }}
        >
          <Item sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: theme.spacing(3.5) }}>
              COPYRIGHT © 2023
            </Typography>
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '.85rem',
                ml: theme.spacing(4),
              }}
            >
              <NextLink
                href="/"
                variant="body1"
                color={theme.palette.text.primary}
                sx={{
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: theme.spacing(3.5),
                }}
              >
                {t('ODA.VN')}
              </NextLink>
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FooterContent;
