export interface ModalActionProp {
  /**
   * Title dialog
   * @default undefined
   */
  title: string;
  /**
   * Sub Title dialog
   * @default undefined
   */
  subTitle?: string;
  /**
   * Disable button ok
   * @default true
   */
  disableOk?: boolean;
  /**
   * Disable button cancel
   * @default false
   */
  disableCancel?: boolean;
  /**
   * Disable button cancel
   * @default false
   */
  disableRemove?: boolean;
  /**
   * trigger when click confirm
   */
  onClickDelete?: () => void;
  /**
   * Text button Delete
   * @default undefined
   */
  textButtonDelete?: string;
  /**
   * Color button Delete
   * @default undefined
   */
  colorButtonDelete?: "inherit" | "error" | "primary" | "secondary" | "info" | "success" | "warning"
  enableIcon?: boolean,
  /**
   * Class custom
   * @default undefined
   */
  classCustom?: string;
}
