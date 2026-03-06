// ** MUI Components
import { Button, Divider, Stack } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ThumbnailType } from '@/components/shared-components/Image';
import Lightbox from '../light-box/lightbox';

interface IUploadQRCode {
  handleUploadFileImage?: (e: any) => void;
  handleRemoveFileImage?: (e: any) => void;
  imageDefault?: string;
  image?: string;
  readonly?: boolean;
  showHelperText?: boolean;
  imageName?: string;
}

// Styled BoxUploadImageStyled
const BoxUploadImageStyled = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  width: '100%',

  '& .content-container': {
    display: 'flex',
    // default for xs
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing(2),

    // override at sm and up
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      gap: theme.spacing(4),
    },
  },

  '& .qr-code-container': {
    width: '150px',
    height: '150px',
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(3),
  },

  '& .qr-code-image': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  '& .MuiButton-root': {
    padding: 0,
    minWidth: 'auto',
    textTransform: 'capitalize',
    fontWeight: 500,
    fontSize: theme.spacing(4),
  },

  '& .buttons-container': {
    display: 'flex',
  },

  '& .helper-text': {
    fontSize: '12px',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
}));

const UploadQRCode = (props: IUploadQRCode) => {
  // Translation
  const { t } = useTranslation();
  // Hooks
  const theme = useTheme();

  // Props
  const {
    handleUploadFileImage,
    handleRemoveFileImage,
    imageDefault = 'images/image.png',
    image,
    readonly = false,
    showHelperText = false,
    imageName,
  } = props;
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  //   </>
  const boxContentUploadImage = useCallback(() => {
    if (!image) {
      return (
        <Button
          variant="text"
          component="label"
          sx={{ color: theme.palette.customColors.colorCyan }}
        >
          {t('add_photo')}
          <input
            type="file"
            accept="image/png, image/jpeg"
            max={1}
            hidden
            onChange={handleUploadFileImage}
          />
        </Button>
      );
    }

    // There are images
    return (
      <Stack direction="row" spacing={4}>
        <Button
          variant="text"
          component="label"
          onChange={handleUploadFileImage}
          sx={{
            color: theme.palette.customColors.colorCyan,
            marginRight: theme.spacing(4),
          }}
        >
          {t('change')}
          <input type="file" accept="image/png, image/jpeg" max={1} hidden />
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          variant="text"
          component="label"
          onClick={handleRemoveFileImage}
          sx={{ color: theme.palette.error.main }}
        >
          {t('remove')}
        </Button>
      </Stack>
    );
  }, [image]);

  return (
    <>
      <BoxUploadImageStyled className="BoxQRCodeGroup">
        <Box className="content-container">
          <Box className="qr-code-container">
            <Image
              className="qr-code-image"
              thumbnailType={ThumbnailType.MEDIUM_200}
              src={image || imageDefault}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.currentTarget.src = '/images/image.png';
              }}
              alt="QR code"
              onClick={() => setIsLightboxOpen(true)}
            />
          </Box>
          <Box className="buttons-container">
            {!readonly && boxContentUploadImage()}
          </Box>
        </Box>
        {showHelperText && !readonly && (
          <Typography variant="body2" className="helper-text" sx={{ mt: 1 }}>
            {t(
              'dialog:only_jpg_and_png_are_supported_up_to_a_max_file_size_of_5mb'
            )}
          </Typography>
        )}
      </BoxUploadImageStyled>
      {isLightboxOpen && (
        <Lightbox
          src={image || imageDefault}
          alt={image || ''}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default UploadQRCode;
