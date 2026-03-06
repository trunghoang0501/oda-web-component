/**
 * Provider component to initialize supplier information masking utilities
 * This should be placed inside Redux Provider to access user state
 */
import { ReactNode } from 'react';
import { useSupplierInfo } from '@/hooks/useSupplierInfo';

interface ISupplierInfoProviderProps {
  children: ReactNode;
}

export const SupplierInfoProvider = ({
  children,
}: ISupplierInfoProviderProps) => {
  // Initialize supplier information masking permission checker
  useSupplierInfo();

  return <>{children}</>;
};
