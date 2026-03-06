import { ArrowBackIosNewOutlined } from '@mui/icons-material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckIcon from '@mui/icons-material/Check';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetLanguagesQuery } from '@/apis/common';
import NextLink from '@/components/shared-components/NextLink';
import { useAuth } from '@/hooks/useAuth';
import useIsInAppWebView from '@/hooks/useIsInAppWebView';
import { useSettings } from '@/hooks/useSettings';
import { userSelectors } from '@/store/slices/user';
import { ILanguage, ILocale } from '@/types';
import {
  LanguageEnum,
  callAppFunction,
  getLoginUrl,
  getSettingAccountUrl,
  getSettingSubscriptionUrl,
} from '@/utils';
import {
  AppFunctionName,
  IMAGE_DEFAULT,
  SHOW_SUBSCRIPTION,
  mediaMobileMax,
} from '@/utils/constants';
import { generateAccountCompanyUrl } from '@/utils/routing/account-company';
import { ROUTER_PATH_HEADQUARTERS } from '@/utils/routing/headquarters';

const LanguageBoxStyled = styled(Box)(({ theme }) => ({
  position: 'absolute',
  background: '#FFFFFF',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 0, 2),
  transform: 'translateX(100%)',
  transition: '0.3s',
  '&.open': {
    transform: 'translateX(0)',
    minHeight: theme.spacing(50),
  },
}));

const imageDefault = IMAGE_DEFAULT.USER;

const UserDropdown = () => {
  const theme = useTheme();
  const router = useRouter();
  const { settings, saveSettings } = useSettings();
  const inAppWebView = useIsInAppWebView();
  const { t } = useTranslation();
  const userInfo = useSelector(userSelectors.getUser);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [toggleLanguage, setToggleLanguage] = useState<boolean>(false);
  const { logout } = useAuth();

  const { data: languagesData } = useGetLanguagesQuery();

  const locales: ILocale[] = useMemo(() => {
    if (!languagesData?.data) return [];
    return languagesData.data.map((lang: ILanguage) => ({
      key: lang.code as LanguageEnum,
      label: lang.name,
      value: lang.code as LanguageEnum,
      img: lang.flag_url,
    }));
  }, [languagesData]);

  const currentLocale = locales.find(
    (locale) => locale.value === settings.language
  );
  const originMenuItems = [
    {
      id: 1,
      link: getSettingAccountUrl(),
      label: t('account'),
      icon: <AccountCircleOutlinedIcon sx={{ mr: 2 }} />,
    },
    {
      id: 2,
      link: generateAccountCompanyUrl(),
      label: t('company'),
      icon: <HomeWorkOutlinedIcon sx={{ mr: 2 }} />,
    },
    {
      id: 3,
      link: getSettingSubscriptionUrl(),
      label: t('subscription'),
      icon: <CardMembershipIcon sx={{ mr: 2 }} />,
    },
    {
      id: 4,
      link: null,
      label: t('language'),
      icon: <LanguageIcon sx={{ mr: 2 }} />,
      onClick: () => setToggleLanguage(true),
      rightContent: (
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          <Typography>{currentLocale?.label}</Typography>
          <ArrowForwardIosIcon sx={{ fontSize: theme.spacing(4), ml: 2 }} />
        </Box>
      ),
    },
  ];

  const onSelectLocale = async (locale: LanguageEnum) => {
    saveSettings({
      ...settings,
      language: locale as LanguageEnum,
    });
    router.reload();
  };

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
    setToggleLanguage(false);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
    setTimeout(() => {
      setToggleLanguage(false);
    }, 500);
  };

  const handleLogOut = () => {
    logout();
    callAppFunction(AppFunctionName.logout);
    window.location.href = getLoginUrl();
  };

  const isHeadquarterRoute = useMemo(() => {
    if (!router.isReady) return false;
    return router.asPath.includes(ROUTER_PATH_HEADQUARTERS.HEADQUARTERS);
  }, [router.asPath, router.isReady]);

  const [menuItems, setMenuItems] = useState(originMenuItems);
  useEffect(() => {
    let filteredItems = originMenuItems;

    // Filter subscription if needed
    if (inAppWebView || !SHOW_SUBSCRIPTION) {
      filteredItems = filteredItems.filter(
        (menuItem) => menuItem.link !== getSettingSubscriptionUrl()
      );
    }

    // Filter Account and Company in headquarters
    if (isHeadquarterRoute) {
      filteredItems = filteredItems.filter(
        (menuItem) =>
          menuItem.link !== getSettingAccountUrl() &&
          menuItem.link !== generateAccountCompanyUrl()
      );
    }

    setMenuItems(filteredItems);
  }, [inAppWebView, isHeadquarterRoute]);

  const handleRedirectLink = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer', alignItems: 'center', p: 0 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Typography
          sx={{
            mr: 4,
            color: 'text.primary',
            fontWeight: 500,
            lineHeight: theme.spacing(6),
            [mediaMobileMax]: {
              display: 'none',
            },
          }}
        >
          {userInfo?.fullName}
        </Typography>
        <Avatar
          alt={userInfo?.fullName ?? ''}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={userInfo?.picture ?? imageDefault}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        sx={{
          '& .MuiMenu-paper': {
            [mediaMobileMax]: {
              position: 'fixed',
              top: `${theme.spacing(13)} !important`,
              right: 0,
              bottom: 0,
            },
          },
          '& .MuiMenu-list': {
            py: 2,
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 'auto',
            maxHeight: theme.spacing(80),
            height: 'auto',
            overflowY: 'auto',
            ...(toggleLanguage && {
              minHeight: theme.spacing(50),
            }),
            [mediaMobileMax]: {
              width: '100%',
            },
          },
        }}
      >
        <LanguageBoxStyled className={toggleLanguage ? 'open' : ''}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              p: 2,
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
              },
            }}
            onClick={() => setToggleLanguage(false)}
          >
            <IconButton>
              <ArrowBackIosNewOutlined sx={{ fontSize: theme.spacing(4) }} />
            </IconButton>
            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
              {t('language')}
            </Typography>
          </Box>
          <List
            sx={{
              pt: 0,
              '& .MuiListItem-root': {
                py: theme.spacing(1),
                px: theme.spacing(2),
              },
            }}
          >
            {locales && locales.length > 0 ? (
              locales.map((locale: ILocale) => {
                const isSelected = locale.value === settings.language;
                return (
                  <ListItem
                    button
                    key={locale.key}
                    onClick={() => onSelectLocale(locale.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: theme.spacing(6) }}>
                      <img loading="lazy" width="20" src={locale.img} alt="" />
                    </ListItemIcon>
                    <ListItemText primary={locale.label} />
                    {isSelected && (
                      <CheckIcon
                        sx={{
                          color: theme.palette.success.main,
                          ml: 'auto',
                          fontSize: theme.spacing(5),
                        }}
                      />
                    )}
                  </ListItem>
                );
              })
            ) : (
              <ListItem>
                <ListItemText primary={t('no_languages_available')} />
              </ListItem>
            )}
          </List>
        </LanguageBoxStyled>
        {menuItems.map((item) => (
          <MenuItem sx={{ p: 0 }} key={item?.id}>
            {item?.link ? (
              <NextLink
                href={item?.link ?? '/'}
                variant="body1"
                color="primary"
                sx={{
                  textDecoration: 'none',
                  margin: 0,
                  color: theme.palette.text.primary,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  p: theme.spacing(3, 4),
                }}
                onClick={handleRedirectLink}
              >
                <>
                  {item?.icon}
                  {item?.label}
                  {item?.rightContent}
                </>
              </NextLink>
            ) : (
              <Box
                onClick={item?.onClick}
                sx={{
                  width: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  p: theme.spacing(3, 4),
                  [mediaMobileMax]: {
                    width: '100%',
                  },
                }}
              >
                {item?.icon}
                {item?.label}
                {item?.rightContent}
              </Box>
            )}
          </MenuItem>
        ))}
        <MenuItem sx={{ p: 0 }}>
          <Box
            sx={{
              textDecoration: 'none',
              textAlign: 'center',
              margin: 0,
              color: theme.palette.text.primary,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              p: theme.spacing(3, 4),
            }}
            onClick={handleLogOut}
          >
            <>
              <LogoutOutlinedIcon sx={{ mr: 2 }} />
              {t('log_out')}
            </>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserDropdown;
