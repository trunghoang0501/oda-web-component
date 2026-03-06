import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';

export const CustomActionBar = (props: PickersActionBarProps) => {
  const { onAccept, onClear, onCancel } = props;
  const [t] = useTranslation();

  return (
    <Stack direction="row" justifyContent="space-between" sx={{p: 7, textTransform: "uppercase"}}>
      <Typography onClick={onClear} color="error" sx={{ cursor: 'pointer', py: 1.5, px: 5 }}>
        {t('reset')}
      </Typography>
      <Stack direction="row" justifyContent="space-between" spacing={6}>
        <Typography
          onClick={onCancel}
          color="error"
          sx={{ cursor: 'pointer', py: 1.5, px: 7.5 }}
        >
          {t('cancel')}
        </Typography>
        <Typography
          color="primary"
          onClick={onAccept}
          sx={{ cursor: 'pointer', py: 1.5, px: 3 }}
        >
          {t('question:ok')}
        </Typography>
      </Stack>
    </Stack>
  );
};
