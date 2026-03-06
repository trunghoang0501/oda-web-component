import React from 'react';

interface ZaloShareButtonProps {
  urlHref?: string;
}

export const ZaloShareButton: React.FC<ZaloShareButtonProps> = ({
  urlHref = '',
}) => {
  return (
    <div
      className="zalo-share-button"
      data-href={urlHref}
      data-oaid="580108655304936510"
      data-layout="5"
      data-color="white"
      data-customize="true"
      style={{ cursor: 'pointer', display: 'flex' }}
    >
      <img
        src="/images/landing-home/footer-section/zalo.svg"
        width="25px"
        height="25px"
        alt=""
      />
      <span
        style={{
          margin: 0,
          color: '#6E6B7B',
          fontFamily:
            'Noto Sans,Inter,sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: '1.5',
          letterSpacing: '0.15px',
          marginLeft: '10px',
        }}
      >
        Zalo
      </span>
    </div>
  );
};
