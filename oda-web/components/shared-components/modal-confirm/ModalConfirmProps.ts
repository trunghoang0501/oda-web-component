import { MouseEvent } from 'react';

export interface ModalConfirmProps {
  /**
   * Title dialog
   * @default undefined
   */
  title: string;
  /**
   * trigger when click confirm
   */
  subTitle?: string;
  /**
   * Disable button ok
   * @default true
   */
  onClickConfirm?: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  /**
   * Title yes button
   * @default undefined
   */
  yesText?: string;
  /**
   * Title no button
   * @default undefined
   */
  noText?: string;

  onCancelConfirm?: () => void;
}
