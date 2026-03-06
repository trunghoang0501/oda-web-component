export interface ModalNotificationProps {
  /**
   * Title dialog
   * @default undefined
   */
  title: string;
  /**
   * Trigger when modal close
   */
  onClose?: () => void;
  /**
   * trigger when click confirm
   */
  onClickConfirm?: () => void;
  /**
   * show confirm button
   */
  showConfirm?: boolean;
  /**
   * show close button
   */
  showClose?: boolean;
  /**
   * confirm text
   */
  confirmText?: string;
  /**
   * close text
   */
  closeText?: string;
}
