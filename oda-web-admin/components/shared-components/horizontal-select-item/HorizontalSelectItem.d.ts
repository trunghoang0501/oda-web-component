import { ReactElement } from 'react';

export interface HorizontalSelectItemProps {
  /**
   * icon label
   * @default undefined
   */
  icon?: string | string[] | ReactNode;
  /**
   * Left label
   * @default undefined
   */
  label: string;
  /**
   * middle label
   * @default undefined
   */
  value?: string;
  /**
   * placeholder of middle label
   * @default undefined
   */
  valuePlaceholder?: string;
  /**
   * placeholder of middle label
   * @default undefined
   */
  onClick?: () => void;
  /**
   * placeholder of middle label
   * @default undefined
   */
  rightComponent?: () => ReactElement;
  /**
   * if `disable` is true, user can't click on item
   * @default false
   */
  disable?: boolean;
  /**
   * Img by value Horizontal
   * @default undefined
   */
  img?: string;
  sx?: SxProps<Theme>;
}
