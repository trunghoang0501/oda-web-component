import {
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translate } from '@/i18n/translate';
import { ProductSearchTypeEnum } from '@/types';
import { mediaMobileMax } from '@/utils/constants';

interface IInputSearchByTypeProps {
  inputRef?: RefObject<HTMLInputElement>;
  onChangeInputSearch: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  valueSearch?: string;
  valueSearchType?: number;
  onChangeSearchType: (event: SelectChangeEvent) => void;
}

export const PRODUCT_TYPES = [
  {
    id: ProductSearchTypeEnum.ProductName,
    label: translate('product_name'),
  },
  {
    id: ProductSearchTypeEnum.ProductSku,
    label: translate('product_sku'),
  },
  {
    id: ProductSearchTypeEnum.PartnerName,
    label: translate('partner_name'),
  },
];

const InputSearchByType = (props: IInputSearchByTypeProps) => {
  const {
    inputRef,
    onChangeInputSearch,
    onChangeSearchType,
    valueSearch,
    valueSearchType,
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const onChangeSearch = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(event?.target?.value);
    onChangeInputSearch(event);
  };

  useEffect(() => {
    setValue(valueSearch || '');
  }, [valueSearch]);

  return (
    <Stack
      direction="row"
      sx={{
        [mediaMobileMax]: {
          width: '100%',
        },
      }}
    >
      <Box
        sx={{
          [mediaMobileMax]: {
            width: 100,
            '& .MuiSelect-select': {
              minWidth: '0 !important',
              px: 2,
              pr: `${0}!important`,
            },
          },
        }}
      >
        <Select
          autoWidth
          value={valueSearchType?.toString()}
          onChange={onChangeSearchType}
          sx={{
            height: theme.spacing(10),
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            '&:after': {
              position: 'absolute',
              width: theme.spacing(0.25),
              height: theme.spacing(6),
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              bottom: 0,
              content: '""',
              background: theme.palette.text.secondary,
            },

            '& .MuiOutlinedInput-notchedOutline': {
              borderRight: `0 !important`,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.text.secondary,
            },
            [mediaMobileMax]: {
              width: theme.spacing(30),
              fontSize: theme.spacing(3),
            },
          }}
        >
          {PRODUCT_TYPES.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <OutlinedInput
        inputRef={inputRef}
        defaultValue={valueSearch}
        value={value}
        fullWidth
        sx={{
          height: theme.spacing(10),
          minWidth: theme.spacing(90),
          [mediaMobileMax]: {
            width: '100%',
            ml: 4.75,
            minWidth: 0,
          },
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          pl: 0,
          '& .MuiOutlinedInput-notchedOutline': {
            borderLeft: `0 !important`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.secondary,
          },
        }}
        onChange={onChangeSearch}
        placeholder={`${t('search')}...`}
      />
    </Stack>
  );
};

export default InputSearchByType;
