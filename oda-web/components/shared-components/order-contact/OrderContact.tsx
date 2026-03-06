import {
  Box,
  Chip,
  ChipProps,
  Grid,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SetupMessageTypeEnum } from '@/constants';
import { useAppSelector } from '@/hooks/useStore';
import { companySelectors } from '@/store/slices/company';
import { IOrderMessageContact } from '@/types';
import { mediaMobileMax } from '@/utils/constants';
import { formatPhoneNumber } from '@/utils/phone';
import { formatSupplierName } from '@/utils/supplier-info';

interface IOrderContactProps {
  message: IOrderMessageContact[];
}

export const BoxChipItemStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  height: theme.spacing(10),
  borderRadius: theme.spacing(5),
  '& .MuiChip-label': {
    fontWeight: 500,
    fontSize: theme.spacing(4),
    lineHeight: theme.spacing(6),
    color: theme.palette.text.primary,
    padding: theme.spacing(2, 4),
  },
}));

export const OrderContact = ({ message }: IOrderContactProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const currentCompany = useAppSelector(companySelectors.getCompany)!;
  const zaloValues = message
    .filter(
      (item: { type: { id: SetupMessageTypeEnum } }) =>
        item.type.id === SetupMessageTypeEnum.Zalo
    )
    .flatMap((item: { value: any }) => item.value);

  const emailValues = message
    .filter(
      (item: { type: { id: SetupMessageTypeEnum } }) =>
        item.type.id === SetupMessageTypeEnum.Email
    )
    .flatMap((item: { value: any }) => item.value);

  const lineValues = message
    .filter(
      (item: { type: { id: SetupMessageTypeEnum } }) =>
        item.type.id === SetupMessageTypeEnum.Line
    )
    .flatMap((item: { value: any }) => item.value);

  return (
    <Box
      p={8}
      bgcolor={theme.palette.background.paper}
      sx={{
        [mediaMobileMax]: {
          p: 4,
        },
      }}
    >
      <Box
        sx={{
          fontSize: theme.spacing(7),
          lineHeight: theme.spacing(9.5),
          fontWeight: 500,
          mb: theme.spacing(8),
          [mediaMobileMax]: {
            fontSize: theme.spacing(5),
            lineHeight: theme.spacing(5),
          },
        }}
      >
        {t('send_order_message_via_email_zalo')}
      </Box>
      <Grid container spacing={4} mt={0} mb={8} alignItems="center">
        <Grid item sx={{ pt: `0 !important` }}>
          <Typography fontWeight={600} textTransform="capitalize">
            {t('email')}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(4),
            pt: `0 !important`,
          }}
        >
          <Box
            sx={{
              '& div.MuiChip-root:not(:first-of-type)': {
                ml: theme.spacing(4),
              },
            }}
          >
            {emailValues.length > 0
              ? emailValues.map((email: string, index: number) => {
                  return (
                    <BoxChipItemStyled
                      key={index}
                      label={formatSupplierName(email)}
                    />
                  );
                })
              : '-'}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={4} mb={8} alignItems="center">
        <Grid item sx={{ pt: `0 !important` }}>
          <Typography fontWeight={600} textTransform="capitalize">
            {t('zalo')}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: theme.spacing(4),
            pt: `0 !important`,
          }}
        >
          <Box
            sx={{
              '& div.MuiChip-root:not(:first-of-type)': {
                ml: theme.spacing(4),
              },
            }}
          >
            {zaloValues.length > 0
              ? zaloValues.map((zalo: string, index: number) => {
                  const phoneNumber = formatPhoneNumber(
                    zalo,
                    currentCompany?.mobile_country_code
                  );
                  return (
                    <BoxChipItemStyled
                      key={index}
                      label={formatSupplierName(phoneNumber)}
                    />
                  );
                })
              : '-'}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={4} mb={8} alignItems="center">
        <Grid item sx={{ pt: `0 !important` }}>
          <Typography fontWeight={600} textTransform="capitalize">
            {t('Line')}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(4),
            pt: `0 !important`,
          }}
        >
          <Box
            sx={{
              '& div.MuiChip-root:not(:first-of-type)': {
                ml: theme.spacing(4),
              },
            }}
          >
            {lineValues.length > 0
              ? lineValues.map((line: string, index: number) => {
                  return (
                    <BoxChipItemStyled
                      key={index}
                      label={formatSupplierName(line)}
                    />
                  );
                })
              : '-'}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
