import { useRef } from 'react';
import { IPopperFilterButtonApi } from './types';

export const useApiRef = () => {
  const apiRef = useRef<IPopperFilterButtonApi>({
    closePopper: () => {
      // Default no-op function - will be replaced by PopperFilterButton component
      // This prevents errors if closePopper is called before the component mounts
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'PopperFilterButton: closePopper called before component initialization'
        );
      }
    },
  });

  return {
    apiRef,
  };
};
