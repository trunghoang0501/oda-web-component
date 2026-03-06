import { Box, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Image, ThumbnailType } from '@/components/shared-components/Image';

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ src, alt, onClose }) => {
  return (
    <Modal
      open
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          outline: 'none',
          bgcolor: 'background.paper',
          p: 1,
          borderRadius: 1,
        }}
      >
        <Image
          thumbnailType={ThumbnailType.MEDIUM_500}
          src={src}
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Modal>
  );
};

export default Lightbox;
