import { equals } from 'rambda';
import React, {
  ClassAttributes,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIsMounted } from '@/hooks';
import defaultImage from '../../../public/images/image.png';

export enum ThumbnailType {
  SMALL_40 = 40,
  SMALL_80 = 80,
  MEDIUM_200 = 200,
  MEDIUM_500 = 500,
  ORIGIN = 0,
  FAIL = 1,
}

type ImageProps = ClassAttributes<HTMLImageElement> &
  React.ImgHTMLAttributes<HTMLImageElement> & {
    defaultSrc?: string;
    thumbnailType: ThumbnailType;
  };

const ImageComponent = ({
  alt,
  src,
  defaultSrc,
  style,
  thumbnailType = ThumbnailType.SMALL_40,
  ...props
}: ImageProps) => {
  const [currentThumbnail, setCurrentThumbnail] = useState(thumbnailType);
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const imageBoxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setImageSrc(src || '');
  }, [src]);

  const isMounted = useIsMounted();

  const onLoadImageError = useCallback(() => {
    if (currentThumbnail === ThumbnailType.ORIGIN) {
      setCurrentThumbnail(ThumbnailType.FAIL);
    } else if (currentThumbnail === ThumbnailType.FAIL) {
      if (defaultSrc && isMounted) {
        setImageSrc(defaultSrc);
      }
    } else {
      setCurrentThumbnail(ThumbnailType.FAIL);
      // setCurrentThumbnail(ThumbnailType.ORIGIN);
    }
  }, [defaultSrc, isMounted]);

  const onLoadStart = useCallback(() => {
    setLoading(false);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        // Element is in the viewport
        setIsHidden(false);
      } else {
        // Element is not in the viewport
        setIsHidden(true);
      }
    });

    if (imageBoxRef.current) {
      observer.observe(imageBoxRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);
  const imageUrl = useMemo(() => {
    if (imageSrc.length === 0) return defaultImage.src;
    const nameFlash = imageSrc.split('/');
    const originUrl = nameFlash[nameFlash.length - 1].split('?')[0];
    const nameArray = originUrl.split('.');
    let tmpName = '';
    let ext = '';
    if (nameArray.length < 2) {
      tmpName = nameArray[0];
    } else {
      tmpName = nameArray[nameArray.length - 2];
      ext = nameArray[nameArray.length - 1];
      nameArray.splice(nameArray.length - 1, 1);
    }
    switch (currentThumbnail) {
      case ThumbnailType.SMALL_40:
      case ThumbnailType.SMALL_80:
      case ThumbnailType.MEDIUM_200:
      case ThumbnailType.MEDIUM_500:
        nameArray.splice(
          nameArray.length - 1,
          1,
          `${tmpName}_${currentThumbnail}${currentThumbnail}`
        );
        if (ext.length > 0) {
          nameArray.push(ext);
        }
        nameFlash.splice(nameFlash.length - 1, 1, `${nameArray.join('.')}`);
        return nameFlash.join('/');
      case ThumbnailType.ORIGIN:
        return imageSrc;
      case ThumbnailType.FAIL:
        return defaultImage.src;
    }
  }, [imageSrc, currentThumbnail]);
  return (
    <div
      ref={imageBoxRef}
      {...props}
      style={{
        ...style,
        position: 'relative',
      }}
    >
      {!isHidden && (
        <img
          alt={alt}
          src={imageUrl}
          onError={onLoadImageError}
          onLoad={onLoadStart}
          style={{
            display: 'block',
            ...style,
          }}
          {...props}
          className={`thumb_${thumbnailType} ${props.className}`}
        />
      )}
      {(isHidden || loading) && (
        <img
          {...props}
          // @ts-ignore
          alt={`${alt + 1}`}
          src={defaultImage.src}
          style={{
            position: 'absolute',
            height: style?.height ?? props?.height,
            width: style?.width ?? props?.width,
            top: 0,
            borderRadius: style?.borderRadius,
            border: style?.border,
          }}
        />
      )}
    </div>
  );
};

export const Image = memo(ImageComponent, equals);
