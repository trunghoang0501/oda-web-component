import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Modal,
  styled,
  useTheme,
} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderHistoryEnum } from '@/constants/order';
import { mediaMobileMax } from '@/utils/constants';
import HistoryProductStatus, {
  HistoryProducStatusEnum,
} from './HistoryProductStatus';
import ProductList from './ProductList';
import UpdatedProductList from './UpdatedProductList';

const ProductStatusStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginLeft: theme.spacing(5),
  marginBottom: theme.spacing(2),
  '&:before': {
    content: '""',
    position: 'absolute',
    height: theme.spacing(3),
    width: theme.spacing(3),
    background: theme.palette.customColors.tableBorder,
    borderRadius: '50%',
    left: theme.spacing(-5),
    top: theme.spacing(1.5),
  },
}));

export const UpdatedOrderImageModal = (props: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data = null, onOk, actionId, ...restProps } = props;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Dialog
        PaperProps={{
          sx: {
            minWidth: 1100,
            width: 1100,
            maxWidth: 1100,
            borderRadius: theme.spacing(4),
            boxShadow: `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`,
            [mediaMobileMax]: {
              minWidth: `calc(100% - ${theme.spacing(8)})!important`,
              width: `calc(100% - ${theme.spacing(8)})!important`,
            },
          },
        }}
        scroll="body"
        {...restProps}
      >
        <DialogTitle
          className="MuiDialogContent-title"
          sx={{ pb: theme.spacing(6), [mediaMobileMax]: { p: 4 } }}
        >
          {t('updated_delivery_photos')}
        </DialogTitle>
        <DialogContent
          sx={{
            [mediaMobileMax]: {
              p: 4,
              overflowY: 'auto',
              maxHeight: `calc(100vh - ${theme.spacing(80)})`,
            },
          }}
        >
          <Box>
            <ProductStatusStyle>
              <HistoryProductStatus
                status={
                  actionId === OrderHistoryEnum.OrderImageAdded
                    ? HistoryProducStatusEnum.Added
                    : HistoryProducStatusEnum.Removed
                }
              />
            </ProductStatusStyle>
            <List>
              {data.detail.order.map((item: any, index: number) => (
                <>
                  <ListItem>
                    <ListItemText
                      sx={{
                        wordBreak: 'break-word',
                        '& .MuiListItemText-primary': {
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 1,
                        },
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 'bold' }}>
                        {t('name')}:
                      </Box>
                      <Box component="span">
                        <Box
                          component="span"
                          onClick={() => handleImageClick(item.to.url)}
                          sx={{
                            cursor: 'pointer',
                            color: theme.palette.primary.main,
                            textDecoration: 'underline',
                            wordBreak: 'break-all',
                            display: 'inline-block',
                          }}
                        >
                          {item.to.name}
                        </Box>
                      </Box>
                    </ListItemText>
                  </ListItem>
                  {index !== data.detail.order.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            pt: theme.spacing(4),
            gap: theme.spacing(4),
            [mediaMobileMax]: { p: 4 },
          }}
        >
          <Button
            type="button"
            variant="contained"
            color="primary"
            sx={{
              width: 100,
              [mediaMobileMax]: {
                width: '100%',
              },
            }}
            onClick={() => onOk()}
          >
            {t('ok')}
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={Boolean(selectedImage)}
        onClose={handleCloseImage}
        aria-labelledby="image-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt=""
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          )}
          <Button
            onClick={handleCloseImage}
            sx={{
              position: 'absolute',
              top: -40,
              right: 0,
              color: 'white',
            }}
          >
            {t('close')}
          </Button>
        </Box>
      </Modal>
    </>
  );
};
