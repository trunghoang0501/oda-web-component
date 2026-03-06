import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mediaMobileMax } from '@/utils/constants';

interface IProductSkuProps {
  sku?: string;
  isEditMode?: boolean;
  onClickEdit?: () => void;
  onClickCancelEdit?: () => void;
  onClickSave?: (sku: string) => void;
}

const ProductSku = (props: IProductSkuProps) => {
  const {
    sku,
    isEditMode = true,
    onClickEdit,
    onClickCancelEdit,
    onClickSave,
  } = props;

  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [skuValue, setSkuValue] = useState(sku || '');

  const handleClickEdit = () => {
    if (onClickEdit) onClickEdit();
    setIsEditing(true);
  };

  const handleClickSave = () => {
    if (onClickSave) onClickSave(skuValue);
    setIsEditing(false);
  };

  const onClickCancel = () => {
    if (onClickCancelEdit) onClickCancelEdit();
    setIsEditing(false);
  };
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" gap={2} alignItems="center">
        <Typography
          fontWeight={500}
          sx={{
            [mediaMobileMax]: {
              color: theme.palette.text.secondary,
            },
          }}
        >
          {t('sku')}:
        </Typography>
        <Box>
          {isEditing ? (
            <Stack direction="row" alignItems="center" gap={2}>
              <TextField
                variant="standard"
                value={skuValue}
                onChange={(event) => {
                  setSkuValue(event.target.value);
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    py: 0,
                    pb: 1,
                    fontWeight: 600,
                  },
                }}
              />
              <CheckIcon
                color="primary"
                sx={{
                  cursor: 'pointer',
                }}
                onClick={handleClickSave}
              />
              <CloseOutlinedIcon
                color="error"
                onClick={onClickCancel}
                sx={{
                  cursor: 'pointer',
                }}
              />
            </Stack>
          ) : (
            <Stack direction="row" gap={1} alignItems="center">
              <Typography
                fontWeight={600}
                sx={{
                  [mediaMobileMax]: {
                    color: theme.palette.text.secondary,
                  },
                }}
              >
                {sku ?? '-'}
              </Typography>
              {isEditMode && (
                <EditOutlinedIcon
                  onClick={handleClickEdit}
                  sx={{
                    cursor: 'pointer',
                  }}
                />
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </>
  );
};

export default ProductSku;
