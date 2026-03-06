export interface ModalConfirmProp {
  /**
   * Title dialog
   * @default undefined
   */
  title: string;
  /**
   * Sub Title dialog
   * @default undefined
   */
  subTitle?: () => ReactElement;
  /**
   * Disable button ok
   * @default true
   */
  disableOk?: boolean | true;
  /**
   * Disable button cancel
   * @default false
   */
  disableCancel?: boolean | false;
  /**
   * Disable button cancel
   * @default false
   */
  disableConfirm?: boolean | false;
  /**
   * trigger when click confirm
   */
  onConfirm?: () => void;
  /**
   * Cancel button text
   * @default undefined
   */
  cancelButtonText?: string;
  /**
   * Confirm button text
   * @default undefined
   */
  confirmButtonText?: string;
  /**
   * Ok button text
   * @default undefined
   */
  okButtonText?: string;
  /**
   * Confirm button color
   * @default undefined
   */
  confirmButtonColor?:
    | 'inherit'
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | 'primary'
    | 'secondary';
}
