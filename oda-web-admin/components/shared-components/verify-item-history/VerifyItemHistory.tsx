import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { VerifiedEnum } from '@/constants';
import { TypeAction } from '@/types';
import VerifyButton from './VerifyButton';

export interface ISelectItem {
  title?: string;
  date_updated?: string;
  from?: string | JSX.Element;
  to?: string | JSX.Element;
  data?: JSX.Element | JSX.Element[];
  verified?: VerifiedEnum;
}

interface IVerifyItemHistoryProps {
  selectItem?: ISelectItem;
  onChangeVerifyStatus?: (status: TypeAction) => void;
}

const TitleStyled = styled(Typography)(({ theme }: any) => ({
  fontSize: theme.spacing(4),
  fontWeight: 600,
  lineHeight: theme.spacing(6),
  color: theme.palette.customColors.tableText,
}));

const LabelStyled = styled(Typography)(({ theme }: any) => ({
  fontSize: theme.spacing(3.5),
  minWidth: theme.spacing(31.5),
  width: theme.spacing(31.5),
}));

const TextStyled = styled(Typography)(({ theme }: any) => ({
  fontSize: theme.spacing(3.5),
}));

export const VerifyItemHistory = ({
  selectItem,
  onChangeVerifyStatus,
}: IVerifyItemHistoryProps) => {
  const { t } = useTranslation();

  return (
    <Stack overflow="hidden" sx={{ pt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <TitleStyled>{selectItem?.title ?? `-`}</TitleStyled>
        {selectItem?.verified !== undefined && (
          <VerifyButton
            verified={selectItem?.verified}
            onChange={onChangeVerifyStatus}
          />
        )}
      </Stack>
      <Stack direction="row" mb={2}>
        <LabelStyled>{t('date_update')}</LabelStyled>
        <TextStyled>{selectItem?.date_updated ?? `-`}</TextStyled>
      </Stack>
      {selectItem?.data ? (
        <Stack direction="row">
          <LabelStyled />
          <Box mt={2} sx={{ mt: 2, ml: 1, minWidth: 0, flex: 1 }}>
            {selectItem.data}
          </Box>
        </Stack>
      ) : (
        <>
          <Stack direction="row" mb={2}>
            <LabelStyled>{t('from')}:</LabelStyled>
            <TextStyled>{selectItem?.from ?? `-`}</TextStyled>
          </Stack>
          <Stack direction="row">
            <LabelStyled>{t('to')}:</LabelStyled>
            <TextStyled>{selectItem?.to ?? `-`}</TextStyled>
          </Stack>
        </>
      )}
    </Stack>
  );
};
