import CloseIcon from '@mui/icons-material/Close';
import { Box, Fade, IconButton, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAITrackingQuery } from '@/apis/menu';

const AIAssistantContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: theme.spacing(2),
}));

const AIBotContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 80,
  height: 80,
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const AIBotImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  backgroundColor: 'transparent',
  '& img': {
    borderRadius: '50%',
  },
}));

const SpeechBubble = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -60,
  left: 0,
  backgroundColor: 'white',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  maxWidth: 200,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '8px solid white',
  },
}));

const AIContext = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  minWidth: 400,
  maxWidth: 500,
  maxHeight: 400,
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const AIContextHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const AIIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: '#f44336',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '14px',
}));

const RippleEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  border: '2px solid #1976d2',
  animation: 'ripple 2s infinite',
  '@keyframes ripple': {
    '0%': {
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 1,
    },
    '100%': {
      transform: 'translate(-50%, -50%) scale(1.4)',
      opacity: 0,
    },
  },
}));

interface AIAssistantProps {
  onClose?: () => void;
  aiRequestId?: string | null;
  onGenerateButtonStateChange?: (isDisabled: boolean) => void;
  onContextChange?: (
    productContext: string | null,
    menuContext: string | null
  ) => void;
  onAiRequestIdReset?: () => void;
  onTrackingDataChange?: (
    trackingData: {
      action: string;
      is_finished: boolean;
      summary: string;
      product_content?: string;
      menu_content?: string;
      missingIngredients?: string;
    } | null
  ) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  onClose,
  aiRequestId,
  onGenerateButtonStateChange,
  onContextChange,
  onAiRequestIdReset,
  onTrackingDataChange,
}) => {
  // eslint-disable-line react/no-unused-prop-types
  const { t } = useTranslation();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [productContext, setProductContext] = useState<string | null>(null);
  const [menuContext, setMenuContext] = useState<string | null>(null);

  // AI tracking query - only call when aiRequestId is not null
  const { data: trackingData, refetch } = useGetAITrackingQuery(
    aiRequestId || '',
    {
      skip: !aiRequestId,
    }
  );

  // Polling effect - refetch every 5 seconds when aiRequestId exists and not finished
  React.useEffect(() => {
    if (!aiRequestId) return;

    const interval = setInterval(() => {
      // Only refetch if not finished
      if (!trackingData?.data?.is_finished) {
        refetch();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [aiRequestId, refetch, trackingData?.data?.is_finished]);

  // Control expanded state based on aiRequestId
  React.useEffect(() => {
    if (aiRequestId !== null) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [aiRequestId]);

  // Handle tracking data updates
  React.useEffect(() => {
    if (trackingData?.data) {
      const {
        action,
        is_finished: isFinished,
        product_content: productContent,
        menu_content: menuContent,
        summary,
        missing_ingredients: missingIngredients,
      } = trackingData.data;

      // Handle generate button state
      const isDisabled = action === 'create-dish-sample' && !isFinished;
      onGenerateButtonStateChange?.(isDisabled);

      // Update contexts
      if (productContent) {
        setProductContext(productContent);
      }
      if (menuContent) {
        setMenuContext(menuContent);
      }

      // Notify parent of tracking data changes
      const trackingDataForParent = {
        action: trackingData.data.action,
        is_finished: trackingData.data.is_finished,
        summary: trackingData.data.summary,
        product_content: trackingData.data.product_content,
        menu_content: trackingData.data.menu_content,
        missingIngredients: Array.isArray(missingIngredients)
          ? missingIngredients.join(', ')
          : missingIngredients,
      };
      onTrackingDataChange?.(trackingDataForParent);

      // Note: We don't reset aiRequestId when finished to keep AI component open
    } else {
      // Clear tracking data when no data
      onTrackingDataChange?.(null);
    }
  }, [
    trackingData,
    onGenerateButtonStateChange,
    onAiRequestIdReset,
    onTrackingDataChange,
  ]);

  // Notify parent of context changes
  React.useEffect(() => {
    onContextChange?.(productContext, menuContext);
  }, [productContext, menuContext, onContextChange]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsExpanded(false);
    onClose?.();
  };

  // Get dynamic content based on tracking data
  const getHeaderTitle = () => {
    if (trackingData?.data?.action === 'create-dish-sample') {
      return t('Generate Recipe Suggestions');
    }
    if (trackingData?.data?.action === 'mapping-ingredient') {
      return t('Map Ingredients');
    }
    return t('Welcome');
  };

  const getContextContent = () => {
    if (trackingData?.data?.summary) {
      return trackingData.data.summary;
    }
    return 'Hello. How are you today?';
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

  return (
    <AIAssistantContainer>
      <Fade in={isExpanded} timeout={300}>
        <AIContext>
          <AIContextHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* <AIIcon>Ai</AIIcon> */}
              <Typography fontWeight="bold">{getHeaderTitle()}</Typography>
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
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </AIContextHeader>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                textAlign: 'center',
                py: 2,
              }}
            >
              {getContextContent()}
            </Typography>
          </Box>
        </AIContext>
      </Fade>

      <AIBotContainer onClick={handleToggle}>
        <RippleEffect />
        <AIBotImage>
          <Image
            src="/images/ai/ai.png"
            alt="AI Assistant"
            width={80}
            height={80}
            style={{
              objectFit: 'contain',
            }}
          />
        </AIBotImage>
        <SpeechBubble>
          <Typography variant="body2" fontWeight="medium">
            {t('Oda AI')}
          </Typography>
        </SpeechBubble>
      </AIBotContainer>
    </AIAssistantContainer>
  );
};

export default AIAssistant;
