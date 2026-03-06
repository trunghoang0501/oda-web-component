import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Stack, Typography, useTheme } from '@mui/material';

interface ITrendStatus {
  percentage: number;
}

const COLOR = {
  DOWN_TREND: {
    BACKGROUND: '#F46A6A1F',
    COLOR: '#F46A6A',
  },
  UP_TREND: {
    BACKGROUND: '#40B65F1F',
    COLOR: '#40B65F',
  },
};

export const TrendStatus = (props: ITrendStatus) => {
  const { percentage } = props;
  const theme = useTheme();

  const color = (() => {
    return percentage < 0 ? COLOR.DOWN_TREND.COLOR : COLOR.UP_TREND.COLOR;
  })();

  const renderIcon = (() => {
    const sx = {
      paddingTop: theme.spacing(1),
      color,
    };

    return percentage < 0 ? (
      <TrendingDownIcon sx={sx} />
    ) : (
      <TrendingUpIcon sx={sx} />
    );
  })();

  const rounded = Math.round(percentage * 100) / 100;
  const displayValue = rounded.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedPercentage =
    percentage > 0 ? `+${displayValue}%` : `${displayValue}%`;

  return (
    <Stack flexDirection="row" alignItems="center">
      {renderIcon}
      <Typography
        fontSize={theme.spacing(3.5)}
        color={color}
        component="span"
        ml={1}
      >
        {formattedPercentage}
      </Typography>
    </Stack>
  );
};
