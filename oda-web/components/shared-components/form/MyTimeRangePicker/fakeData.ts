import { ITimeRangeItem } from '@/types/time-range';

export const fakeTimeRangeList: ITimeRangeItem[] = [
  {
    id: 1,
    name: 'Delivery now',
    from: null,
    to: null,
  },
  {
    id: 2,
    name: '00:00 ~ 04:00',
    from: 0,
    to: 4,
  },
  {
    id: 3,
    name: '04:00 ~ 08:00',
    from: 4,
    to: 8,
  },
  {
    id: 4,
    name: '08:00 ~ 12:00',
    from: 8,
    to: 12,
  },
  {
    id: 5,
    name: '12:00 ~ 16:00',
    from: 12,
    to: 16,
  },
  {
    id: 6,
    name: '16:00 ~ 20:00',
    from: 16,
    to: 20,
  },
  {
    id: 7,
    name: '20:00 ~ 24:00',
    from: 20,
    to: 24,
  },
];
