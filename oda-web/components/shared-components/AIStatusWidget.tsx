import { CheckCircle, Close, InfoOutlined } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Fab,
  IconButton,
  Paper,
  SvgIcon,
  SvgIconProps,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAITrackingQuery } from '@/apis/menu';

type TrackingDataPayload = {
  action: string;
  is_finished: boolean;
  summary: string;
  product_content?: string;
  menu_content?: string;
  missingIngredients?: string[];
  data?: any; // The actual tracking_response.data containing menu items
};

interface AIStatusWidgetProps {
  aiRequestId?: string | null;
  onClose?: () => void;
  onGenerateButtonStateChange?: (isDisabled: boolean) => void;
  onContextChange?: (context: {
    productContext: string | null;
    menuContext: string | null;
    missingIngredients?: string[] | null;
  }) => void;
  onAiRequestIdReset?: () => void;
  onTrackingDataChange?: (trackingData: TrackingDataPayload | null) => void;
  titleResolver?: (params: {
    action?: string;
    isProcessing: boolean;
  }) => string;
  pollIntervalMs?: number;
}

const AIIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <rect
      x={6}
      y={8}
      width={12}
      height={8}
      rx={3}
      ry={3}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    />
    <path
      d="M4 12h2"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    />
    <path
      d="M18 12h2"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    />
    <path
      d="M12 8V6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    />
    <circle
      cx={12}
      cy={5}
      r={1}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    />
    <circle cx={10} cy={12} r={1} fill="currentColor" />
    <circle cx={14} cy={12} r={1} fill="currentColor" />
  </SvgIcon>
);

const AIStatusWidget: React.FC<AIStatusWidgetProps> = ({
  aiRequestId,
  onClose,
  onGenerateButtonStateChange,
  onContextChange,
  onAiRequestIdReset,
  onTrackingDataChange,
  titleResolver,
  pollIntervalMs = 5000,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [userManuallyClosed, setUserManuallyClosed] = useState(false);
  const [logs, setLogs] = useState<
    Array<{
      id: string;
      text: string;
      type: string;
      icon: string;
      timestamp: string;
      trackingId: string;
      action: string;
    }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const [productContext, setProductContext] = useState<string | null>(null);
  const [menuContext, setMenuContext] = useState<string | null>(null);
  const [missingIngredientsContext, setMissingIngredientsContext] = useState<
    string[] | null
  >(null);
  const [lastProcessedMessage, setLastProcessedMessage] = useState<
    string | null
  >(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logCounterRef = useRef<number>(0);

  // AI tracking query - only call when aiRequestId is not null
  const { data: trackingData, refetch } = useGetAITrackingQuery(
    aiRequestId || '',
    {
      skip: !aiRequestId,
    }
  );

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Polling effect - refetch at the provided interval when tracking is active
  React.useEffect(() => {
    if (!aiRequestId) return;
    if (!pollIntervalMs || pollIntervalMs <= 0) return;

    const interval = setInterval(() => {
      // Only refetch if not finished
      if (!trackingData?.data?.is_finished) {
        refetch();
      }
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [aiRequestId, pollIntervalMs, refetch, trackingData?.data?.is_finished]);

  // Control expanded state based on aiRequestId
  React.useEffect(() => {
    if (aiRequestId !== null) {
      // Auto-open when new tracking starts, unless user manually closed it
      if (!userManuallyClosed) {
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
      setUserManuallyClosed(false); // Reset when tracking ends
    }
  }, [aiRequestId, userManuallyClosed]);

  // Handle tracking data updates
  React.useEffect(() => {
    if (!trackingData?.data) {
      onTrackingDataChange?.(null);
      return;
    }

    const {
      action,
      is_finished: isFinished,
      product_content: rawProductContext,
      menu_content: rawMenuContext,
      summary,
    } = trackingData.data;
    const rawMissingIngredients = trackingData.data.missing_ingredients as
      | string[]
      | string
      | null
      | undefined;

    // Extract data field if it exists in trackingData.data
    const trackingResponseData = (trackingData.data as any).data;

    // Handle generate button state
    const isDisabled = action === 'create-dish-sample' && !isFinished;
    onGenerateButtonStateChange?.(isDisabled);

    // Update processing state
    setIsProcessing(!isFinished);
    if (!isFinished) {
      setHasNewActivity(true);
    }

    const normalizedProductContext =
      rawProductContext && rawProductContext.trim().length
        ? rawProductContext
        : null;
    const normalizedMenuContext =
      rawMenuContext && rawMenuContext.trim().length ? rawMenuContext : null;

    setProductContext(normalizedProductContext);
    setMenuContext(normalizedMenuContext);

    const normalizedMissingIngredients: string[] = (() => {
      if (Array.isArray(rawMissingIngredients)) {
        return rawMissingIngredients
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter((item): item is string => Boolean(item));
      }

      if (typeof rawMissingIngredients === 'string') {
        const trimmed = rawMissingIngredients.trim();
        return trimmed ? [trimmed] : [];
      }

      return [];
    })();

    setMissingIngredientsContext(
      normalizedMissingIngredients.length ? normalizedMissingIngredients : null
    );

    // Notify parent of tracking data changes
    const trackingDataForParent: TrackingDataPayload = {
      action,
      is_finished: isFinished,
      summary,
      product_content: rawProductContext,
      menu_content: rawMenuContext,
      data: trackingResponseData,
    };

    if (normalizedMissingIngredients.length) {
      trackingDataForParent.missingIngredients = normalizedMissingIngredients;
    }

    onTrackingDataChange?.(trackingDataForParent);
  }, [trackingData, onGenerateButtonStateChange, onTrackingDataChange]);

  // Notify parent of context changes
  React.useEffect(() => {
    if (!onContextChange) return;

    onContextChange({
      productContext,
      menuContext,
      missingIngredients: missingIngredientsContext,
    });
  }, [onContextChange, productContext, menuContext, missingIngredientsContext]);

  // Clear all logs when aiRequestId changes (new session starts)
  React.useEffect(() => {
    if (aiRequestId) {
      // Clear all logs and reset processed message when starting a new session
      setLogs([]);
      setLastProcessedMessage(null);
      setProductContext(null);
      setMenuContext(null);
      setMissingIngredientsContext(null);
      setHasNewActivity(false);
      logCounterRef.current = 0; // Reset counter for new session
    } else {
      // Clear all logs when no active tracking
      setLogs([]);
      setLastProcessedMessage(null);
      setProductContext(null);
      setMenuContext(null);
      setMissingIngredientsContext(null);
      setIsProcessing(false);
      setHasNewActivity(false);
      logCounterRef.current = 0; // Reset counter
    }
  }, [aiRequestId]);

  // Generate logs from tracking data - accumulate logs for same tracking session
  React.useEffect(() => {
    if (!trackingData?.data || !aiRequestId) return;

    const { action, is_finished: isFinished, summary } = trackingData.data;
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    setLogs((prev) => {
      // Add message log if summary exists and is different from last message
      if (summary && summary.trim()) {
        const currentMessage = summary.trim();

        // Check if this exact message already exists in the logs for this tracking session
        const messageExists = prev.some(
          (log) => log.text === currentMessage && log.trackingId === aiRequestId
        );

        // Also check if this is the same as the last processed message (prevent stale API responses)
        const isStaleMessage = lastProcessedMessage === currentMessage;

        // Only add if this message doesn't exist for this session and is not stale
        if (!messageExists && !isStaleMessage) {
          // Increment counter for unique key generation
          logCounterRef.current += 1;
          const messageLog = {
            id: `${aiRequestId}-${action}-message-${logCounterRef.current}`,
            text: currentMessage,
            type: isFinished ? 'success' : 'info',
            icon: isFinished ? 'success' : 'info',
            timestamp,
            trackingId: aiRequestId,
            action,
          };

          // Update the last processed message
          setLastProcessedMessage(currentMessage);

          return [...prev, messageLog];
        }
      }

      return prev;
    });
  }, [trackingData?.data, aiRequestId, lastProcessedMessage]);

  const handleOpen = () => {
    setIsOpen(true);
    setUserManuallyClosed(false);
    setHasNewActivity(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setUserManuallyClosed(true);
    // Don't call onClose to keep tracking active, just hide the UI
  };

  const getDefaultTitle = React.useCallback(
    (action?: string) => {
      if (action === 'create-dish-sample') {
        return t('menu:generate_recipe_suggestions');
      }
      if (action === 'mapping-ingredient') {
        return t('menu:map_ingredients');
      }
      return t('menu:ai_status_monitor');
    },
    [t]
  );

  // Get dynamic content based on tracking data
  const getHeaderTitle = () => {
    const action = trackingData?.data?.action;
    const resolved = titleResolver?.({ action, isProcessing });
    if (resolved) {
      return resolved;
    }

    return getDefaultTitle(action);
  };

  // Get AI status
  const getAIStatus = () => {
    if (trackingData?.data) {
      return trackingData.data.is_finished
        ? t('menu:ai_status_done')
        : t('menu:ai_status_waiting');
    }
    return null;
  };

  const getIcon = (iconType: string) => {
    const theme = useTheme();
    switch (iconType) {
      case 'success':
        return (
          <CheckCircle
            sx={{ width: 20, height: 20, color: theme.palette.success.main }}
          />
        );
      case 'loading':
        return (
          <CircularProgress
            size={20}
            sx={{ color: theme.palette.primary.main }}
          />
        );
      case 'start':
        return (
          <AIIcon
            sx={{
              width: 24,
              height: 24,
              color: theme.palette.secondary.main,
            }}
          />
        );
      case 'info':
      default:
        return (
          <InfoOutlined
            sx={{ width: 20, height: 20, color: theme.palette.text.secondary }}
          />
        );
    }
  };

  const theme = useTheme();

  return (
    <Box>
      {/* Floating Button - show when closed AND there's active tracking */}
      {!isOpen && aiRequestId && userManuallyClosed && (
        <Box
          sx={{
            position: 'fixed',
            bottom: theme.spacing(3),
            right: theme.spacing(3),
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Pulsing Ripple Rings Effect */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                animation:
                  'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                '@keyframes pulse-ring': {
                  '0%': {
                    transform: 'scale(0.8)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.2)',
                    opacity: 0.5,
                  },
                  '100%': {
                    transform: 'scale(1.6)',
                    opacity: 0,
                  },
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                animation:
                  'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                animationDelay: '1s',
                '@keyframes pulse-ring': {
                  '0%': {
                    transform: 'scale(0.8)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.2)',
                    opacity: 0.5,
                  },
                  '100%': {
                    transform: 'scale(1.6)',
                    opacity: 0,
                  },
                },
              }}
            />
          </Box>

          <Fab
            onClick={handleOpen}
            color="primary"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[12],
              },
              transition: 'all 0.2s',
            }}
          >
            <AIIcon sx={{ color: 'white', fontSize: 28 }} />

            {/* Status Indicator */}
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: `2px solid white`,
                backgroundColor: isProcessing
                  ? theme.palette.warning.main
                  : theme.palette.success.main,
                animation: isProcessing ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    opacity: 1,
                  },
                  '50%': {
                    opacity: 0.5,
                  },
                  '100%': {
                    opacity: 1,
                  },
                },
              }}
            />
          </Fab>
        </Box>
      )}

      {/* Expanded Status Panel - show when open */}
      {isOpen && (
        <Card
          sx={{
            position: 'fixed',
            bottom: theme.spacing(3),
            right: theme.spacing(3),
            borderRadius: theme.spacing(3),
            width: 450, // w-96 equivalent
            height: 550,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUpFade 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '@keyframes slideUpFade': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px) scale(0.9)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              },
            },
          }}
        >
          {/* Header */}
          <CardHeader
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              p: 2,
              px: 4,
              color: 'white',
            }}
            avatar={
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <AIIcon sx={{ width: 24, height: 24, color: 'white' }} />
              </Box>
            }
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'white', fontWeight: 600 }}
                >
                  {getHeaderTitle()}
                </Typography>
                {getAIStatus() && (
                  <Box
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: trackingData?.data?.is_finished
                        ? '#4caf50'
                        : '#ff9800',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {getAIStatus()}
                  </Box>
                )}
              </Box>
            }
            subheader={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: isProcessing
                      ? theme.palette.warning.light
                      : theme.palette.success.light,
                    animation: isProcessing ? 'pulse 2s infinite' : 'none',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {isProcessing ? 'Processing...' : 'Idle'}
                </Typography>
              </Box>
            }
            action={
              <IconButton
                onClick={handleClose}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  width: 32,
                  height: 32,
                }}
              >
                <Close sx={{ width: 16, height: 16, color: 'white' }} />
              </IconButton>
            }
          />

          {/* Activity Counter */}
          <Box
            sx={{
              px: 4,
              py: 1,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[900]
                  : theme.palette.grey[50],
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, color: theme.palette.text.primary }}
            >
              Activity Log
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.primary }}
            >
              {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
            </Typography>
          </Box>

          {/* Logs Area - Console Style */}
          <CardContent
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              px: 4,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[900]
                  : theme.palette.grey[50],
              fontFamily: 'monospace',
              fontSize: '0.875rem',

              '&:last-child': {
                paddingBottom: 2,
              },
            }}
          >
            {logs.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: theme.palette.text.primary,
                }}
              >
                <AIIcon sx={{ width: 64, height: 64, mb: 1.5, opacity: 0.5 }} />
                <Typography variant="body2">
                  {t('menu:no_ai_activity')}
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {t('menu:ai_requests_placeholder')}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {logs.map((log) => (
                  <Paper
                    key={log.id}
                    elevation={1}
                    sx={{
                      p: 2,
                      py: 3.5,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      borderRadius: 1,
                      boxShadow: 'none',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      },
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Box sx={{ flexShrink: 0, mt: 0.25 }}>
                      {getIcon(log.icon)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: theme.palette.text.primary,
                          lineHeight: 1.4,
                          wordBreak: 'break-word',
                        }}
                      >
                        {log.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.primary,
                          fontSize: '14px',
                          mt: 0.5,
                          display: 'block',
                        }}
                      >
                        {log.timestamp}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}

            <Box ref={logsEndRef} />
          </CardContent>

          {/* Footer */}
          <Box
            sx={{
              p: 1.5,
              px: 4,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.primary }}
              >
                {t('menu:read_only_monitor')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    backgroundColor: theme.palette.success.main,
                    borderRadius: '50%',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {t('menu:connected')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export type { TrackingDataPayload };

export default AIStatusWidget;
