import { IIdName, ProductSourceEnum } from '@/types';

export interface ISupplierOption {
  id: string;
  supplierId: number;
  name: string;
  type: ProductSourceEnum;
}

export interface IPartnerFilterValue {
  localSupplierSelected: IIdName[];
  linkedPartnerSelected: IIdName[];
}
