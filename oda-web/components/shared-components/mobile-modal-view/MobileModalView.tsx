import { Box, Button, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const MobileModalView = ({
  onCancel,
  onSave,
  child,
  title,
  isEnableSubmit = true,
  showCancel = true,
  textSave = 'save',
  buttonSaveType,
  buttonSaveColorType = 'primary',
}: {
  title: string;
  isEnableSubmit?: boolean;
  showCancel?: boolean;
  onCancel?: () => void;
  textSave?: string;
  onSave: () => void;
  child: React.ReactChild;
  buttonSaveType?: 'text' | 'contained' | 'outlined' | undefined;
  buttonSaveColorType?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 1300,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '16px',
          p: 4,
          width: '90vw',
          maxWidth: theme.spacing(100),
        }}
      >
        <Box textAlign="center" fontSize={theme.spacing(4.5)} fontWeight="600">
          {t(title)}
        </Box>
        {child}
        <Box
          mt={4}
          sx={{
            '& button': {
              width: showCancel ? 'calc(50% - 0.5rem)' : '100%',
            },
          }}
        >
          {showCancel && (
            <Button onClick={onCancel} variant="outlined" color="secondary">
              {t('cancel')}
            </Button>
          )}
          <Button
            onClick={onSave}
            disabled={!isEnableSubmit}
            sx={{
              ml: showCancel ? theme.spacing(4) : 0,
            }}
            variant={buttonSaveType}
            color={buttonSaveColorType}
          >
            {t(textSave)}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
