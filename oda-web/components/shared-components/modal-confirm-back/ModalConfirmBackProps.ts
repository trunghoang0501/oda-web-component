export interface ModalConfirmBackProps {
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
  onClickDelete?: () => void;
}
