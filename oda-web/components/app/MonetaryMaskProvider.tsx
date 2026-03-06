/**
 * Provider component to initialize monetary masking utilities
 * This should be placed inside Redux Provider to access user state
 */
import { ReactNode } from 'react';
import { useMonetaryMask } from '@/hooks/useMonetaryMask';

interface IMonetaryMaskProviderProps {
  children: ReactNode;
}

export const MonetaryMaskProvider = ({
  children,
}: IMonetaryMaskProviderProps) => {
  // Initialize monetary masking permission checker
  useMonetaryMask();

  return <>{children}</>;
};
