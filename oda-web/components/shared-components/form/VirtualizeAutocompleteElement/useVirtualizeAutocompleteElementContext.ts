import { SxProps } from '@mui/material';
import { createContext, useContext } from 'react';

type VirtualizeAutocompleteElementContext = {
  isLoadingMore: boolean;
  isFetching: boolean;
  onFetchMore?: () => void;
  sx?: SxProps;
};

const initialValues: VirtualizeAutocompleteElementContext = {
  isLoadingMore: false,
  isFetching: false,
  onFetchMore: () => {},
};

export const VirtualizeAutocompleteElementContext =
  createContext<VirtualizeAutocompleteElementContext>(initialValues);

export const useVirtualizeAutocompleteElementContext = () =>
  useContext<VirtualizeAutocompleteElementContext>(
    VirtualizeAutocompleteElementContext
  );
