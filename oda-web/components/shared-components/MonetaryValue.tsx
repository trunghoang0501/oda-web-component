/**
 * Component for displaying monetary values with automatic masking
 * Usage: <MonetaryValue value={price} format="price" />
 */
import { Box, BoxProps } from '@mui/material';
import { useAppSelector } from '@/hooks/useStore';
import { userSelectors } from '@/store/slices/user';
import { MASKED_VALUE } from '@/utils/constants';
import { formatMoney, formatPrice } from '@/utils/money';

interface IMonetaryValueProps extends BoxProps {
  value: string | number;
  format?: 'money' | 'price';
  symbol?: string;
  emptyValue?: string;
  children?: never; // Prevent children prop
}

export const MonetaryValue = ({
  value,
  format = 'money',
  symbol,
  emptyValue = '-',
  ...boxProps
}: IMonetaryValueProps) => {
  const currentUser = useAppSelector(userSelectors.getUser);
  const canViewMonetaryValues = currentUser?.view_monetary_values ?? true;

  const displayValue = (() => {
    if (value === null || value === undefined || value === '') {
      return emptyValue;
    }

    if (!canViewMonetaryValues) {
      return MASKED_VALUE;
    }

    if (format === 'price') {
      return formatPrice(value, symbol);
    }

    return formatMoney(value, symbol);
  })();

  return <Box {...boxProps}>{displayValue}</Box>;
};
