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
  subTitle: string;
  /**
   * trigger when click confirm
   */
  onClickConfirm?: () => void;
}
