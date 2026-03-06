import React from 'react';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollProps {
  loadMore: () => void; // Adjust return type as needed
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ loadMore }) => {
  const [ref, inView] = useInView({
    rootMargin: '50px',
  });

  React.useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView]);

  return <div ref={ref} style={{ height: '10px' }} />;
};

export default InfiniteScroll;
