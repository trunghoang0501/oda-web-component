import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetBankInformationListQuery } from '@/apis';
import { ChangeBankAccountModal } from '@/containers/sales/add-edit-sale-order/components/ChangeBankAccountModal';
import { transformBankInformation } from '@/containers/sales/add-edit-sale-order/utils';
import { useMyModal } from '@/hooks/useMyModal';
import { ICompanyBankInformation } from '@/types';
import { hexToRGBA } from '@/utils';
import { formatSupplierName } from '@/utils/supplier-info';

interface IBankInformationProps {
  bankInformation: ICompanyBankInformation;
  isShowChangeButton?: boolean;
  onChange?: (data: ICompanyBankInformation) => void;
}

export const BankInformation = (props: IBankInformationProps) => {
  const { bankInformation, isShowChangeButton = true, onChange } = props;

  const theme = useTheme();
  const myModal = useMyModal();
  const { t } = useTranslation();

  const { data: bankInformationListResponse } = useGetBankInformationListQuery(
    {}
  );

  const bankInformationList = (bankInformationListResponse?.data || []).map(
    (item) => transformBankInformation(item)
  );

  const handleChangeBankAccount = () => {
    const instanceModal = myModal.showModal(ChangeBankAccountModal, {
      initialData: bankInformationList,
      defaultValue: bankInformation.id,
      onCancel: () => {
        instanceModal.destroy();
      },
      onConfirm: (data: ICompanyBankInformation) => {
        if (onChange) {
          onChange(data);
        }
        instanceModal.destroy();
      },
    });
  };

  return (
    <Box
      mt={6}
      p={2}
      bgcolor={hexToRGBA(theme.palette.customColors.tableBorder, 0.5)}
      borderRadius={theme.spacing(1.5)}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" gap={2}>
          <AccountCircleRoundedIcon
            sx={{
              color: theme.palette.text.secondary,
            }}
          />
          <Typography noWrap fontWeight={600} textTransform="capitalize">
            {formatSupplierName(bankInformation.fullname)}
          </Typography>
        </Stack>
        {isShowChangeButton && (
          <Box
            sx={{
              cursor: 'pointer',
              color: theme.palette.customColors.colorCyan,
            }}
            onClick={handleChangeBankAccount}
          >
            {t('change')}
          </Box>
        )}
      </Stack>
      <Stack direction="row" mt={4} gap={2}>
        <CreditCardOutlinedIcon
          sx={{
            color: theme.palette.text.secondary,
          }}
        />
        <Typography fontWeight={600} textTransform="capitalize" noWrap>
          {formatSupplierName(
            typeof bankInformation.bankName === 'string'
              ? bankInformation.bankName
              : bankInformation.bankName?.name
          )}{' '}
          - {formatSupplierName(bankInformation.accountNumber)}
        </Typography>
      </Stack>
    </Box>
  );
};
