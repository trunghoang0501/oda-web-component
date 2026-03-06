import { useTheme } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/system';
import * as React from 'react';
import { mediaMobileMax } from '@/utils/constants';
import { ICustomizedTooltipsProps } from './CustomizedTooltip';

const HtmlTooltipStyled = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} placement="top" arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    fontSize: theme.spacing(3),
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(2),
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    '&::before': {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.divider}`,
    },
  },
}));

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  '& .MuiSvgIcon-root': {
    fill: theme.palette.text.secondary,
  },
}));

export default function CustomizedTooltips({
  icon,
  label,
  tooltipComponent,
}: ICustomizedTooltipsProps) {
  const theme = useTheme();

  return (
    <TypographyStyled
      sx={{
        [mediaMobileMax]: {
          fontSize: theme.spacing(3.5),
        },
      }}
    >
      {label}
      <HtmlTooltipStyled title={tooltipComponent || ''}>
        <Typography
          component="span"
          width={theme.spacing(5)}
          height={theme.spacing(5)}
          sx={{ marginLeft: theme.spacing(2) }}
        >
          {icon}
        </Typography>
      </HtmlTooltipStyled>
    </TypographyStyled>
  );
}
