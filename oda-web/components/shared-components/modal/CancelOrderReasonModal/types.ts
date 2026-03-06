import { DialogProps } from '@mui/material';

export type IReason = {
  id: string;
  label: string;
};

export interface ICancelOrderReasonModalProps extends DialogProps {
  onCancel: () => void;
  onConfirm: (value: ICancelOrderReasonsFormEnumForm) => void;
  reasons: IReason[];
}

export enum CancelOrderReasonsFormEnum {
  CancelReasonType = 'cancelReasonType',
  Note = 'note',
}

export interface ICancelOrderReasonsFormEnumForm {
  [CancelOrderReasonsFormEnum.CancelReasonType]?: string;
  [CancelOrderReasonsFormEnum.Note]?: string;
}

export const defaultAddEditAdjustmentFormValues: ICancelOrderReasonsFormEnumForm =
  {
    [CancelOrderReasonsFormEnum.CancelReasonType]: undefined,
    [CancelOrderReasonsFormEnum.Note]: undefined,
  };

export enum CANCEL_ORDER_REASON {
  LONG_DELIVERY_TIME = 1,
  CHANGE_OF_MIND = 2,
  ORDERED_WRONG_ITEMS = 3,
  OTHER = 4,
  CUSTOMER_DECLINED_TO_RECEIVE_ORDER = 5,
  STOP_SELLING_PRODUCT = 6,
  OUT_OF_STOCK = 7,
}
