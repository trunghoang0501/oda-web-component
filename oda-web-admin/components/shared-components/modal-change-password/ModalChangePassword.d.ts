import { ReactElement } from 'react';

export interface ModalChangePasswordProps {
  /**
   * Title dialog
   * @default undefined
   */
  title: string;
  /**
   * Sub title dialog
   * @default undefined
   */
  subTitle?: string;
  /**
   * Description dialog
   * @default undefined
   */
  desc?: string;
  /**
   * Trigger when modal close
   */
  onClose?: () => any;
  /**
   * Element
   * @default undefined
   */
  formComponent?: () => ReactElement;
}
