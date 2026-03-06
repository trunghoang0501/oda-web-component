import { Box, SxProps } from '@mui/material';
import React, { ReactNode, RefObject, useEffect, useState } from 'react';

interface StickyProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  stuckClasses?: string;
  unstuckClasses?: string;
  stuckStyles?: SxProps;
  unstuckStyles?: SxProps;
  children: ReactNode;
}

export const Sticky: React.FC<StickyProps> = ({
  position = 'top',
  stuckClasses = '',
  unstuckClasses = '',
  stuckStyles = {},
  unstuckStyles = {},
  children,
}) => {
  const [stuck, setStuck] = useState<boolean>(false);
  const ref: RefObject<HTMLDivElement> = React.createRef();

  const classes = stuck ? stuckClasses : unstuckClasses;
  const styles = stuck ? stuckStyles : unstuckStyles;

  const inlineStyles: SxProps = {
    position: 'sticky',
    zIndex: 1000,
    [position]: -1,
    ...styles,
  };

  useEffect(() => {
    const cachedRef = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => setStuck(e.intersectionRatio < 1),
      { threshold: [1] }
    );

    if (cachedRef) {
      observer.observe(cachedRef);
    }

    return () => {
      if (cachedRef) {
        observer.unobserve(cachedRef);
      }
    };
  }, [ref]);

  return (
    <Box sx={inlineStyles} className={classes} ref={ref}>
      {children}
    </Box>
  );
};
