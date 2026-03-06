import FilterListIcon from '@mui/icons-material/FilterList';
import { Badge, Box, Stack, StackProps, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { mediaMobileMax } from '@/utils/constants';

export interface FilterLabelProps extends StackProps {
  onClick?: () => void;
  showLabelMobile?: boolean;
  filterCount?: number;
}
const FilterLabel = (props: FilterLabelProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { onClick, showLabelMobile = false, filterCount } = props;
  return (
    <Stack
      onClick={onClick}
      direction="row"
      spacing={3}
      alignItems="center"
      maxHeight={theme.spacing(10)}
      {...props}
      sx={{
        [mediaMobileMax]: {
          border: `1px solid ${theme.palette.text.primary}`,
          p: 3,
          borderRadius: theme.spacing(1.5),
          mr: 0,
        },
      }}
    >
      <Badge
        badgeContent={filterCount}
        color="primary"
        invisible={!filterCount || filterCount === 0}
        sx={{
          '& .MuiBadge-badge': {
            fontSize: theme.spacing(2.5),
            minWidth: theme.spacing(4),
            height: theme.spacing(4),
          },
        }}
      >
        <FilterListIcon
          sx={{
            width: theme.spacing(5),
            height: theme.spacing(5),
          }}
        />
      </Badge>
      <Box
        fontWeight={500}
        lineHeight={theme.spacing(6)}
        sx={{
          [mediaMobileMax]: {
            display: showLabelMobile ? 'block' : 'none',
          },
        }}
      >
        {t('filter')}
      </Box>
    </Stack>
  );
};

export default FilterLabel;
