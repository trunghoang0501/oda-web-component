// ** React Imports
import * as React from 'react';
import { useState, SyntheticEvent } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import NextLink from '@/components/shared-components/NextLink';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { dispatch } from '@/store/app-dispatch';
import { setCurrentAccountTab } from '@/store/slices/app';
import { useAuth } from '@/state/auth/AuthContext';
import { useGetUserInfoQuery } from '@/apis';
import { IMAGE_DEFAULT } from '@/constants';

const UserDropdown = () => {
  // Translation
  const [t] = useTranslation();

  const { data: userInfo } = useGetUserInfoQuery();

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  // ** Hooks
  const router = useRouter();

  // ** Hook
  const theme = useTheme();

  const { logOut, setUser } = useAuth();

  React.useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo]);

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  // handle logout account
  const handleLogOut = async () => {
    await logOut();
    router.push('/login');
  };

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
  };
  const menuItems = [
    {
      id: 1,
      link: '/account',
      label: `${t('account')}`,
      icon: <AccountCircleOutlinedIcon sx={{ mr: 2 }} />,
      state: 'account',
    },
    {
      id: 2,
      link: '/account',
      label: `${t('notifications')}`,
      icon: <SettingsOutlinedIcon sx={{ mr: 2 }} />,
      state: 'company',
    },
  ];
  const handleChangeAccountTab = (state: string) => {
    setAnchorEl(null);
    dispatch(
      setCurrentAccountTab({
        apiError: {},
        isExpiredToken: false,
        currentAccountTab: `${state}` as 'account' | 'company',
      })
    );
  };

  return (
    <>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 6, cursor: 'pointer', alignItems: 'center', p: 0 }}
        // badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Typography sx={{ mr: 2, color: 'common.white', fontWeight: 500 }}>
          {`${userInfo?.last_name ?? ''} ${userInfo?.first_name ?? ''}`}
        </Typography>
        <Avatar
          alt={`${userInfo?.last_name} ${userInfo?.first_name ?? ''}`}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={userInfo?.picture ?? IMAGE_DEFAULT.USER}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        sx={{ '& .MuiMenu-list': { paddingTop: 0, paddingBottom: 0 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menuItems.map((item) => (
          <MenuItem sx={{ p: 0 }} key={item?.id}>
            <Box sx={styles}>
              <NextLink
                href={item?.link ?? '/'}
                variant="body1"
                color="primary"
                sx={{
                  textDecoration: 'none',
                  margin: theme.spacing(0),
                  color: theme.palette.text.primary,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => {
                  handleChangeAccountTab(item.state);
                }}
              >
                <>
                  {item?.icon}
                  {item?.label}
                </>
              </NextLink>
            </Box>
          </MenuItem>
        ))}
        <MenuItem sx={{ p: 0 }}>
          <Box sx={styles}>
            <NextLink
              href=""
              variant="body1"
              color="primary"
              sx={{
                textDecoration: 'none',
                textAlign: 'center',
                margin: theme.spacing(0),
                color: theme.palette.error.main,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={handleLogOut}
            >
              <>
                <LogoutOutlinedIcon color="error" sx={{ marginRight: 2 }} />
                {t('log_out')}
              </>
            </NextLink>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserDropdown;
