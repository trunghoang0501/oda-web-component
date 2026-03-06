import { ReactElement } from 'react';

export interface HorizontalSelectItemProps {
  icon?: ReactNode;
  label: ReactNode;
  value?: any;
  valuePlaceholder?: string;
  onClick?: () => void;
  rightComponent?: () => ReactElement;
  disable?: boolean;
  middleComponent?: () => ReactElement;
}
