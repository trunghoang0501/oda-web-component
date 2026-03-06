import { ReactNode } from 'react';

export interface ICustomizedTooltipsProps {
  icon?: ReactNode;
  label?: string;
  tooltipComponent?: NonNullable<ReactNode>;
}
