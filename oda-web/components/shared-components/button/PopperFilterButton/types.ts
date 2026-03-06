import { ButtonProps, SxProps } from '@mui/material';
import { Dispatch, MutableRefObject, ReactNode, SetStateAction } from 'react';

export interface IPopperFilterButtonApi {
  closePopper: () => void;
}

export interface IPopperFilterButtonProps {
  showLabel?: boolean;
  hideLabelIfMobile?: boolean;
  buttonSx?: ButtonProps['sx'];
  filteredCount?: number;
  onClickClearFilterIcon?: () => void;
  onOpenPopper?: () => void;
  onClosePopper?: () => void;
  popperContent: ReactNode;
  onClickPopperClearButton?: () => void;
  onClickPopperConfirmButton?: () => void;
  apiRef?: MutableRefObject<IPopperFilterButtonApi>;
  defaultDataFilters?: any;
  dataFilters?: any;
  setDataFilters?: Dispatch<SetStateAction<any>>;
  hideClearFilter?: boolean;
  noClearButton?: boolean;
  onClickPopperSaveAsDefaultButton?: () => void;
  noShowFilteredCount?: boolean;
  triggerShowPopper?: boolean;
  sx?: SxProps;
}
