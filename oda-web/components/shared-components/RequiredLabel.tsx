import { Stack, SxProps, Typography, useTheme } from '@mui/material';
import deepmerge from 'deepmerge';
import React, { useMemo } from 'react';
import useMobileDetect from '@/hooks/useMobileDetect';
import { mediaMobileMax } from '@/utils/constants';

interface IRequiredLabelProps {
  label?: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'column' | 'title' | 'input';
  sx?: SxProps;
  isRequired?: boolean;
  showInMobile?: boolean;
}

export const RequiredLabel = ({
  label,
  disabled,
  variant = 'default',
  sx,
  isRequired = true,
  showInMobile = true,
}: IRequiredLabelProps) => {
  const theme = useTheme();
  const mobile = useMobileDetect();
  const labelStyles = useMemo(() => {
    let styles: SxProps = {};

    switch (variant) {
      case 'column':
        styles = {
          fontWeight: 700,
          color: theme.palette.text.secondary,
        };
        break;

      case 'title':
        styles = {
          fontSize: theme.spacing(4.5),
          fontWeight: 600,
          lineHeight: theme.spacing(6),
          color: theme.palette.text.primary,
        };
        break;

      case 'input':
        styles = {
          fontSize: mobile.isMobile() ? theme.spacing(3) : theme.spacing(4),
          color: theme.palette.text.primary,
        };
        break;

      default:
        styles = {};
    }

    return deepmerge<SxProps>(styles, sx ?? {});
  }, [variant, mobile.isMobile()]);

  return (
    <Stack
      direction="row"
      className="required-label"
      sx={{
        opacity: disabled ? 0.5 : 1,
        alignItems: 'center',
        [mediaMobileMax]: {
          display: showInMobile ? 'flex' : 'none',
          alignItems: 'flex-start',
        },
      }}
    >
      <Typography sx={labelStyles}>{label}</Typography>
      {isRequired ? (
        <Typography
          color="error"
          sx={{
            [mediaMobileMax]: {
              mt: variant === 'input' ? -1 : undefined,
            },
          }}
        >
          *
        </Typography>
      ) : (
        <></>
      )}
    </Stack>
  );
};
