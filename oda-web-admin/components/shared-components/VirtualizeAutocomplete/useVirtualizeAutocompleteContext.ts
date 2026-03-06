import { createContext, useContext } from 'react';

type VirtualizeAutocompleteContext = {
  isLoadingMore: boolean;
  isFetching: boolean;
  onFetchMore?: () => void;
};

const initialValues: VirtualizeAutocompleteContext = {
  isLoadingMore: false,
  isFetching: false,
  onFetchMore: () => {},
};

export const VirtualizeAutocompleteContext =
  createContext<VirtualizeAutocompleteContext>(initialValues);

export const useVirtualizeAutocompleteContext = () =>
  useContext<VirtualizeAutocompleteContext>(VirtualizeAutocompleteContext);
