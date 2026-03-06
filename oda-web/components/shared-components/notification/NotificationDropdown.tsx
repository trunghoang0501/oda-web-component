import { DoneAllOutlined, SettingsOutlined } from '@mui/icons-material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { CircularProgress, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import {
  SyntheticEvent,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  useDetectNotificationQuery,
  useGetNotificationListQuery,
  useGetNotificationTypesQuery,
  useLazyGetNotificationListQuery,
  useReadAllNotificationMutation,
} from '@/apis';
import {
  NOTIFICATION_QUERY_LIMIT,
  NotificationFilterTypeEnum,
  TIME_TO_UPDATE_NOTIFICATION_API_IN_MS,
} from '@/constants';
import { useSettings } from '@/hooks/useSettings';
import { INotification, INotificationType, ProfileTabEnum } from '@/types';
import { getAccountProfileUrl, getNotificationUrl } from '@/utils/routing/';
import NextLink from '../NextLink';
import NotificationItem from './NotificationItem';
import ScrollWrapper from './ScrollWrapper';
import { DotStyled, MenuStyled } from './style';

const NOTIFICATION_DROPDOWN_LIMIT = 20;
const OFFSET_BOTTOM_TRIGGER_LOAD_MORE = 300; // Increased to trigger load more earlier for smoother UX

const NotificationDropdown = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { settings } = useSettings();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);

  // Initial load with page 1, limit 20
  const {
    data: notificationResponse,
    isFetching,
    refetch,
  } = useGetNotificationListQuery(
    {
      page: 1,
      limit: NOTIFICATION_DROPDOWN_LIMIT,
      type: NotificationFilterTypeEnum.All,
    },
    {
      skip: !open,
    }
  );

  // Lazy query for loading more pages
  const [triggerLoadMore] = useLazyGetNotificationListQuery();

  // Update notifications list when initial response changes
  useEffect(() => {
    if (notificationResponse?.data && open) {
      setNotifications(notificationResponse.data);
      setPage(1);
    }
  }, [notificationResponse, open]);

  // Reset when dropdown closes
  useEffect(() => {
    if (!open) {
      setNotifications([]);
      setPage(1);
      setLoadingMore(false);
    }
  }, [open]);

  const hasNotification = notifications.length > 0;

  const { data: notificationTypeResponse } = useGetNotificationTypesQuery(
    {
      type: NotificationFilterTypeEnum.All,
    },
    {
      skip: !open,
    }
  );
  const notificationType: INotificationType | undefined =
    notificationTypeResponse?.data;

  const { data: detectNotificationResponse } = useDetectNotificationQuery(
    {},
    {
      pollingInterval: TIME_TO_UPDATE_NOTIFICATION_API_IN_MS,
    }
  );

  const notificationDetection = detectNotificationResponse?.data;

  const [readAllNotification, { isLoading: readAllNotiLoading }] =
    useReadAllNotificationMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleReadAll = () => {
    try {
      readAllNotification({
        type: NotificationFilterTypeEnum.All,
      });
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    }
  };

  const isScrollToBottom = (
    scrollTop: number,
    scrollHeight: number,
    offsetHeight: number
  ) => {
    return (
      scrollTop <= scrollHeight - offsetHeight &&
      scrollTop >= scrollHeight - offsetHeight - OFFSET_BOTTOM_TRIGGER_LOAD_MORE
    );
  };

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || isFetching) {
      return;
    }

    const lastPage = notificationResponse?.last_page;
    if (!lastPage || page >= lastPage) {
      return;
    }

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const response = await triggerLoadMore({
        page: nextPage,
        limit: NOTIFICATION_DROPDOWN_LIMIT,
        type: NotificationFilterTypeEnum.All,
      }).unwrap();

      if (response.success && response.data) {
        setNotifications((prev) => [...prev, ...response.data]);
        setPage(nextPage);
      }
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    } finally {
      setLoadingMore(false);
    }
  }, [
    page,
    loadingMore,
    isFetching,
    notificationResponse?.last_page,
    triggerLoadMore,
    enqueueSnackbar,
  ]);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, offsetHeight } = event.currentTarget;

      if (
        isScrollToBottom(scrollTop, scrollHeight, offsetHeight) &&
        !loadingMore &&
        !isFetching
      ) {
        handleLoadMore();
      }
    },
    [handleLoadMore, loadingMore, isFetching]
  );

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      refetch();
    });
    return () => {
      router.events.off('routeChangeComplete', () => {});
    };
  });

  return (
    <>
      <IconButton
        color="inherit"
        aria-haspopup="true"
        onClick={handleDropdownOpen}
        aria-controls="customized-menu"
        sx={{ position: 'relative' }}
      >
        <NotificationsOutlinedIcon
          sx={{ width: theme.spacing(5), height: theme.spacing(5) }}
        />
        {notificationDetection?.display_bell && <DotStyled />}
      </IconButton>
      <MenuStyled
        anchorEl={anchorEl}
        open={open}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gap: theme.spacing(2),
            p: theme.spacing(5, 4),
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: theme.spacing(5),
              color: theme.palette.customColors.tableText,
              lineHeight: theme.spacing(6),
            }}
          >
            {t('notification')}
          </Typography>
          {hasNotification && (
            <Chip
              size="small"
              label={t('$number_news', {
                number: (() => {
                  if (notificationType?.quantity) {
                    return notificationType.quantity > 99
                      ? '99+'
                      : notificationType.quantity;
                  }
                  return 0;
                })(),
              })}
              color="error"
              sx={{
                height: theme.spacing(5),
                fontSize: theme.spacing(3),
                fontWeight: 500,
                borderRadius: theme.spacing(5),
              }}
            />
          )}
          <NextLink
            sx={{
              ml: 'auto',
            }}
            href={getAccountProfileUrl({ tab: ProfileTabEnum.Notification })}
          >
            <Button
              sx={{
                display: 'inline-flex',
                gap: theme.spacing(2),
                p: 2,
              }}
              onClick={handleDropdownClose}
            >
              <SettingsOutlined />
              {t('settings')}
            </Button>
          </NextLink>
          <Button
            sx={{
              minWidth: 'fit-content',
              p: 2,
              '&:disabled': { color: theme.palette.customColors.tableText },
            }}
            onClick={handleReadAll}
            disabled={!notificationType?.quantity || readAllNotiLoading}
          >
            <DoneAllOutlined />
          </Button>
        </Box>
        {isFetching && page === 1 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              pb: 6,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            ref={scrollContainerRef}
            onScroll={handleScroll}
            sx={{
              maxHeight: theme.spacing(100),
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {hasNotification ? (
              <>
                {notifications.map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    language={settings.language}
                  />
                ))}
                {loadingMore && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: theme.spacing(4),
                    }}
                  >
                    <CircularProgress size={20} />
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  p: theme.spacing(3, 4),
                  fontWeight: 600,
                  color: theme.palette.customColors.tableText,
                  lineHeight: theme.spacing(6),
                }}
              >
                {t('there_are_no_notifications')}
              </Box>
            )}
          </Box>
        )}
        {hasNotification && (
          <Box
            sx={{
              p: 4,
              mt: 'auto',
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              onClick={() => {
                setAnchorEl(null);
                router.push(getNotificationUrl());
              }}
              fullWidth
              variant="outlined"
            >
              {t('all_notifications')}
            </Button>
          </Box>
        )}
      </MenuStyled>
    </>
  );
};

export default NotificationDropdown;
