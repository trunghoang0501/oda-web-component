// React Imports
import { KeyboardArrowUp } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Collapse, Container, Typography } from '@mui/material';
// ** MUI Imports
import Box from '@mui/material/Box';
import Grid, { GridProps } from '@mui/material/Grid';
import { styled, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NextLink from '@/components/shared-components/NextLink';
import {
  EMAIL_INFORMATION,
  HOTLINE_INFORMATION,
  HOTLINE_INFORMATION_TEL_URL,
  WORKING_TIME,
} from '@/constants';
import useMobileDetect from '@/hooks/useMobileDetect';
import { useAppSelector } from '@/hooks/useStore';
import { userSelectors } from '@/store/slices/user';
import { ROUTER_PATH, getPrivacyPolicyUrl, getTermOfServiceUrl } from '@/utils';
import { mediaMobileMax } from '@/utils/constants';

const GridContainerStyled = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    position: 'relative',
    '& .MuiGrid-item': {
      width: '100%',
      '&:nth-of-type(2)': {
        paddingLeft: `${theme.spacing(1)} !important`,
      },
      '&:nth-of-type(3)': {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        right: 0,
        width: 'auto',
      },
    },
  },
  [theme.breakpoints.up('xl')]: {
    position: 'relative',
    '& .MuiGrid-item': {
      '&:nth-of-type(2)': {
        paddingLeft: `${theme.spacing(8)} !important`,
      },
    },
  },
}));

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  '& .MuiTypography-root': {
    lineHeight: theme.spacing(5.5),
  },
}));

// Styled component

const FooterContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const mobileDetect = useMobileDetect();
  const currentUser = useAppSelector(userSelectors.getUser);
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const [expanded, setExpand] = useState(true);
  const handleExpanded = () => {
    setExpand(!expanded);
  };
  if (
    currentUser &&
    mobileDetect.isMobile() &&
    !router.asPath.includes(ROUTER_PATH.DASHBOARD)
  ) {
    return <></>;
  }

  return (
    <>
      <Box
        className="footerContent"
        sx={{
          flexGrow: 1,
          [mediaMobileMax]: {
            display: 'none',
          },
        }}
      >
        <GridContainerStyled container spacing={1}>
          <Grid item xs="auto">
            <Item>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: '600',
                  display: 'inline-block',
                  mr: theme.spacing(2),
                }}
              >
                {t('landing_page:customer_service')}:
              </Typography>
              <Typography
                variant="body1"
                sx={{ m: 0, display: 'inline-block' }}
              >
                {t('email')}:
                <NextLink
                  href={`mailto:${EMAIL_INFORMATION}`}
                  variant="body1"
                  color={theme.palette.customColors.colorCyan}
                  sx={{
                    textDecoration: 'none',
                    fontWeight: '500',
                    ml: 2,
                  }}
                >
                  {EMAIL_INFORMATION}
                </NextLink>
                | {t('landing_page:hotline')}:
                <NextLink
                  href={`tel:${HOTLINE_INFORMATION_TEL_URL}`}
                  variant="body1"
                  color={theme.palette.customColors.colorCyan}
                  sx={{
                    textDecoration: 'none',
                    fontWeight: '500',
                    ml: 2,
                  }}
                >
                  {HOTLINE_INFORMATION}
                </NextLink>
              </Typography>
            </Item>
          </Grid>
          <Grid item xs="auto">
            <Item>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: '600',
                  display: 'inline-block',
                  mr: theme.spacing(2),
                }}
              >
                {t('landing_page:service_hours')}:
              </Typography>
              <Typography
                variant="body1"
                sx={{ m: 0, display: 'inline-block' }}
              >
                {t('landing_page:weekdays')}: {WORKING_TIME.normalDate.start} to{' '}
                {WORKING_TIME.normalDate.end} | {t('landing_page:saturday')}:{' '}
                {WORKING_TIME.saturday.start} to {WORKING_TIME.saturday.end}
              </Typography>
            </Item>
          </Grid>
          <Grid
            item
            xs="auto"
            sx={{
              ml: 'auto',
              pl: '0 !important',
              pr: theme.spacing(1),
            }}
          >
            <Item sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontSize: '.85rem' }}>
                COPYRIGHT © {currentYear}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: '600',
                  fontSize: '.85rem',
                  ml: theme.spacing(2),
                }}
              >
                <NextLink
                  href="/"
                  variant="body1"
                  color={theme.palette.text.primary}
                  sx={{
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  {t('Oda.vn')}
                </NextLink>
              </Typography>
            </Item>
          </Grid>
        </GridContainerStyled>
      </Box>
      {/* mobile */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: theme.palette.common.white,
          padding: theme.spacing(4),
          flexGrow: 1,
          position: 'fixed',
          bottom: 0,
          zIndex: 10,
          display: 'none',
          left: 0,
          [mediaMobileMax]: {
            display: 'block',
          },
        }}
      >
        {/* mobile */}
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            '& *': {
              fontSize: theme.spacing(3.5),
            },
          }}
        >
          <Box
            onClick={handleExpanded}
            sx={{
              WebkitTapHighlightColor: 'transparent',
              position: 'absolute',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              width: theme.spacing(28 / 4),
              height: theme.spacing(28 / 4),
              left: `calc(50% - ${theme.spacing(3.5)})`,
              top: `-${theme.spacing(28 / 4)}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDownIcon />}
          </Box>
          <Grid container spacing={1} sx={{ alignItems: 'center', m: 0 }}>
            <Grid container spacing={2} sx={{ m: 0 }}>
              <Grid
                item
                xs="auto"
                sx={{
                  pt: '0 !important',
                  pl: '0 !important',
                  width: `calc(100vw - ${theme.spacing(12)})`,
                }}
              >
                <Item>
                  <Typography variant="body1" sx={{ fontWeight: '600' }}>
                    {t('landing_page:customer_service')}
                  </Typography>
                  <Typography variant="body1" sx={{ m: 0 }}>
                    {t('email')}:
                    <NextLink
                      href={`mailto:${EMAIL_INFORMATION}`}
                      variant="body1"
                      color={theme.palette.customColors.colorCyan}
                      sx={{
                        textDecoration: 'none',
                        fontWeight: '500',
                        ml: 2,
                      }}
                    >
                      {EMAIL_INFORMATION}
                    </NextLink>
                    {' | '}
                    {t('landing_page:hotline')}:
                    <NextLink
                      href={`tel:${HOTLINE_INFORMATION_TEL_URL}`}
                      variant="body1"
                      color={theme.palette.customColors.colorCyan}
                      sx={{
                        textDecoration: 'none',
                        fontWeight: '500',
                        ml: 2,
                      }}
                    >
                      {HOTLINE_INFORMATION}
                    </NextLink>
                  </Typography>
                  {!expanded ? <br /> : <></>}
                </Item>
              </Grid>
            </Grid>
            <Collapse in={!expanded} timeout="auto" unmountOnExit>
              <Grid
                container
                spacing={2}
                sx={{
                  m: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Grid
                  item
                  xs="auto"
                  sx={{
                    pl: '0 !important',
                    pt: '0 !important',
                  }}
                >
                  <Item>
                    <Typography variant="body1" sx={{ fontWeight: '600' }}>
                      {t('landing_page:service_hours')}
                    </Typography>
                    <Typography variant="body1" sx={{ m: 0 }}>
                      {t('landing_page:weekdays')}:{' '}
                      {WORKING_TIME.normalDate.start} to{' '}
                      {WORKING_TIME.normalDate.end} <br />
                      {t('landing_page:saturday')}:{' '}
                      {WORKING_TIME.saturday.start} to{' '}
                      {WORKING_TIME.saturday.end}
                    </Typography>
                    <br />
                  </Item>
                </Grid>
                <Grid
                  item
                  xs="auto"
                  sx={{
                    ml: 'auto',
                    pt: '0 !important',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '0 !important',
                    margin: '0 !important',
                  }}
                >
                  <Box
                    className="footer-divider-vertical"
                    sx={{
                      flexDirection: 'column',
                      display: 'flex',
                    }}
                  >
                    <NextLink
                      href={getPrivacyPolicyUrl()}
                      variant="body1"
                      color={theme.palette.customColors.colorCyan}
                      sx={{
                        textDecoration: 'none',
                        paddingLeft: '0 !important',
                      }}
                    >
                      {t('privacy_policy')}
                    </NextLink>
                    <NextLink
                      href={getTermOfServiceUrl()}
                      variant="body1"
                      color={theme.palette.customColors.colorCyan}
                      sx={{
                        textDecoration: 'none',
                        marginRight: theme.spacing(8),
                      }}
                    >
                      {t('terms_of_service')}
                    </NextLink>
                  </Box>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default FooterContent;
