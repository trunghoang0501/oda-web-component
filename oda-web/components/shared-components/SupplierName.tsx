/**
 * Component for displaying supplier/vendor/partner names with automatic masking
 * Usage: <SupplierName name={vendor.name} fallback="Internal" />
 */
import { Box, BoxProps } from '@mui/material';
import { useAppSelector } from '@/hooks/useStore';
import { userSelectors } from '@/store/slices/user';
import { MASKED_VALUE } from '@/utils/constants';
import { formatSupplierName } from '@/utils/supplier-info';

interface ISupplierNameProps extends BoxProps {
  name: string | null | undefined;
  maskValue?: string;
  emptyValue?: string;
  children?: never; // Prevent children prop
}

export const SupplierName = ({
  name,
  maskValue = MASKED_VALUE,
  emptyValue = '-',
  ...boxProps
}: ISupplierNameProps) => {
  const currentUser = useAppSelector(userSelectors.getUser);
  const canViewSupplierInfo = currentUser?.view_supplier_information ?? true;

  const displayValue = (() => {
    if (name === null || name === undefined || name === '') {
      return emptyValue;
    }

    if (!canViewSupplierInfo) {
      return maskValue;
    }

    return name;
  })();

  return <Box {...boxProps}>{displayValue}</Box>;
};
