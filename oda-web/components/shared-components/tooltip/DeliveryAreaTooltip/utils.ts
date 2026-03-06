import { IDeliveryArea } from '@/types';

export const hasContentToShow = (deliveryArea?: IDeliveryArea[]) => {
  if (!deliveryArea) return false;

  for (let i = 0; i < deliveryArea.length; i++) {
    if (deliveryArea[i].is_enabled) {
      return true;
    }
  }

  return false;
};
