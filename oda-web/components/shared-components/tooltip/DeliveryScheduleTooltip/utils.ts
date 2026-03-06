import { IDeliverySchedule } from '@/types';

export const hasContentToShow = (deliverySchedule?: IDeliverySchedule[]) => {
  if (!deliverySchedule) return false;

  for (let i = 0; i < deliverySchedule.length; i++) {
    if (deliverySchedule[i].is_enabled) {
      return true;
    }
  }

  return false;
};
