import { useEffect } from 'react';
import { PUBLIC_IMAGES_URL } from '@/constants';

interface KakaoShareButtonProps {
  text?: string;
  url?: string;
}

export default function KakaoShare({ text, url }: KakaoShareButtonProps) {
  useEffect(() => {
    kakaoButton();
  }, []);

  const kakaoButton = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      if (!kakao.isInitialized()) {
        kakao.init('6edaa4401f104f26e185cccaa5fa416b');
      }

      kakao.Share.createDefaultButton({
        container: '#kakaotalk-sharing-btn',
        objectType: 'text',
        text: `${text}: ${url}` ?? '',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
        // buttons: [
        //   {
        //     title: 'pie test',
        //     link: {
        //       mobileWebUrl: url,
        //       webUrl: url,
        //     },
        //   }
        // ]
      });
    }
  };

  return (
    <div
      id="kakaotalk-sharing-btn"
      style={{ cursor: 'pointer', display: 'flex' }}
    >
      <img
        src="/images/landing-home/footer-section/kakaotalk.svg"
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
        KakaoTalk
      </span>
    </div>
  );
}
