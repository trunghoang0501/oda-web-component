import { ThumbnailType } from '@/components/shared-components/Image';
import { IProductCommon } from '@/types';
import { ProductPageTypeEnum } from '@/utils/constants';

export interface IProductCardProps {
  product: IProductCommon;
  isChecked?: boolean;
  onCheckProduct?: () => void;
  onClickProduct?: () => void;
  pageType?: ProductPageTypeEnum;
  thumbnailType?: ThumbnailType;
}

export enum ProductDisplayModeEnum {
  LIST,
  CARD,
}

export interface ProductViewStyleButtonProp {
  type: ProductDisplayModeEnum;
  onClick: (type: ProductDisplayModeEnum) => void;
  inMenuBuy?: boolean;
}
