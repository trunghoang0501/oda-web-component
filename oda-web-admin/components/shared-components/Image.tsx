import { equals } from 'rambda';
import React, {
  ClassAttributes,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useIsMounted } from '@/hooks';
import defaultImage from '../../../public/images/image.png';

type ImageProps = ClassAttributes<HTMLImageElement> &
  React.ImgHTMLAttributes<HTMLImageElement> & {
    defaultSrc?: string;
  };

const ImageComponent = ({ alt, src, defaultSrc, ...props }: ImageProps) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    setImageSrc(src || defaultSrc || defaultImage.src);
  }, [src]);

  const isMounted = useIsMounted();

  const onLoadImageError = useCallback(() => {
    if (defaultSrc) {
      setImageSrc(defaultSrc);
    } else {
      setImageSrc(defaultImage.src);
    }
  }, [defaultSrc, isMounted]);

  return (
    <img
      alt={alt}
      src={imageSrc || defaultSrc}
      onError={onLoadImageError}
      {...props}
    />
  );
};

export const Image = memo(ImageComponent, equals);
