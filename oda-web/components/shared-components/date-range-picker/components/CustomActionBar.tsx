import { Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const CustomActionBar = (props: PickersActionBarProps) => {
  const { onAccept, onClear, onCancel } = props;
  const { t } = useTranslation();

  return (
    <>
      <Divider
        sx={{
          height: 2,
        }}
      />
      <Stack direction="row" justifyContent="space-between" p={4}>
        <Typography onClick={onClear} color="error" sx={{ cursor: 'pointer' }}>
          {t('reset')}
        </Typography>
        <Stack direction="row" justifyContent="space-between" spacing={6}>
          <Typography
            color="secondary"
            onClick={onCancel}
            sx={{ cursor: 'pointer' }}
          >
            {t('cancel')}
          </Typography>
          <Typography
            color="info.main"
            onClick={onAccept}
            sx={{ cursor: 'pointer' }}
          >
            {t('question:ok')}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};
