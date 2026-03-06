'use client';

import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkIcon from '@mui/icons-material/Link';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Snackbar,
  SnackbarContent,
  Stack,
  Typography,
} from '@mui/material';
// import { KakaoShareButton, kakaoClipboard } from "react-kakao-share";
import { initKakao } from 'kakao-js-sdk';
import { useSnackbar } from 'notistack';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from 'react-share';
import { text } from 'stream/consumers';
import KakaoShare from './KakaoShare';
import { ZaloShareButton } from './ZaloShareButton';

const SocialShareModal = (props: {
  openShare: boolean;
  setOpenShare: React.Dispatch<React.SetStateAction<boolean>>;
  shareUrl: string;
  setShareUrl: React.Dispatch<React.SetStateAction<string>>;
  textUrl: string;
  setTextUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    openShare,
    setOpenShare,
    shareUrl,
    setShareUrl,
    textUrl,
    setTextUrl,
  } = props;
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyLink = () => {
    const copyTextInside = `${textUrl}: ${shareUrl}`;
    navigator.clipboard
      .writeText(copyTextInside)
      .then(() => {
        enqueueSnackbar(t('favorite_link_copy_success'), {
          variant: 'success',
        });
      })
      .catch(() => {
        console.log('Failed to copy');
      });
  };

  const handleClose = () => setOpenShare(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const socialIcons = [
    { icon: <LinkIcon />, label: 'Copy link', onClick: handleCopyLink },
    { label: 'Zalo' },
    { label: 'Kakaotalk' },
    {
      component: FacebookShareButton,
      icon: <FacebookIcon />,
      label: 'Facebook',
    },
    // { component: FacebookMessengerShareButton, icon: <FacebookMessengerIcon round size="25px"/>, label: "Messenger" },
    { component: EmailShareButton, icon: <EmailIcon />, label: 'Email' },
    {
      component: WhatsappShareButton,
      icon: <WhatsAppIcon />,
      label: 'Whatsapp',
    },
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sp.zalo.me/plugins/sdk.js'; // Replace with official Zalo SDK URL
    // script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true; // Load script asynchronously for improved performance

    // Optional: Add error handling for script loading failures
    script.onerror = () => {
      console.error('Failed to load Zalo SDK script');
    };

    document.body.appendChild(script);

    // Clean up script on component unmount (prevents memory leaks)
    return () => {
      document.body.removeChild(script);
    };
  }, [shareUrl]); // Empty dependency array ensures script loads only once

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true; // Load script asynchronously for improved performance

    // Optional: Add error handling for script loading failures
    script.onerror = () => {
      console.error('Failed to load Zalo SDK script');
    };

    document.body.appendChild(script);

    // Clean up script on component unmount (prevents memory leaks)
    return () => {
      document.body.removeChild(script);
    };
  }, [shareUrl]); // Empty dependency array ensures script loads only once

  return (
    <div>
      <hr />

      <Modal open={openShare} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6">{t('share_favorite_link')}</Typography>
          <List>
            {socialIcons.map((social, index) => {
              if (social.label === 'Copy link') {
                return (
                  <ListItem key={index} onClick={social.onClick}>
                    <ListItemIcon style={{ cursor: 'pointer' }}>
                      {social.icon}
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
                        {social.label}
                      </span>
                    </ListItemIcon>
                  </ListItem>
                );
              }
              if (social.label === 'Zalo') {
                return (
                  <ListItem key="zalo">
                    <ListItemIcon>
                      <ZaloShareButton urlHref={shareUrl} />
                    </ListItemIcon>
                  </ListItem>
                );
              }
              if (social.label === 'Kakaotalk') {
                return (
                  <ListItem key="kakao">
                    <ListItemIcon>
                      <KakaoShare text={textUrl} url={shareUrl} />
                    </ListItemIcon>
                  </ListItem>
                );
              }
              const ShareButtonComponent: any = social.component;
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ShareButtonComponent
                      url={shareUrl}
                      hashtag={textUrl}
                      style={{
                        display: 'flex',
                      }}
                    >
                      {social.icon}{' '}
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
                        {social.label}
                      </span>
                    </ShareButtonComponent>
                  </ListItemIcon>
                  {/* <ListItemText primary={social.label} /> */}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        action={
          <IconButton onClick={handleSnackbarClose} color="inherit">
            <CheckIcon />
          </IconButton>
        }
      >
        <SnackbarContent
          sx={{ bgcolor: 'success.main', color: 'white' }}
          message={t('favorite_link_copy_success')}
        />
      </Snackbar>
    </div>
  );
};

export default SocialShareModal;
