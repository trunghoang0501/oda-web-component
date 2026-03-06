import { FormControl, InputLabel, useTheme } from '@mui/material';
import { AutocompleteElement } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useGetBankInformationListQuery } from '@/apis';
import { ICompanyBankInformation } from '@/types';

export const BankAccountSelect = ({ name }: { name: string }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { data: bankInformationResponse } = useGetBankInformationListQuery({});

  const bankInformationList: ICompanyBankInformation[] = (
    bankInformationResponse?.data || []
  ).map((item) => ({
    id: item.id,
    fullname: item.name,
    bankName: item.bank,
    accountNumber: item.bank_account,
    bankQrCode: item.bank_qr_code,
    isDefault: item.is_default,
  }));

  return (
    <FormControl fullWidth>
      <InputLabel
        sx={{ background: theme.palette.common.white, px: 2 }}
        shrink
        required
      >
        {t('bank_account')}
      </InputLabel>
      <AutocompleteElement
        options={bankInformationList}
        name={name}
        textFieldProps={{
          InputLabelProps: {
            shrink: true,
          },
          placeholder: t('select_bank_account'),
        }}
        autocompleteProps={{
          getOptionLabel: (options: ICompanyBankInformation) =>
            `${options.fullname} - ${options.bankName.name} - ${options.accountNumber}`,
          isOptionEqualToValue: (option, value) => option.id === value.id,
          selectOnFocus: true,
          clearOnBlur: true,
          handleHomeEndKeys: true,
          componentsProps: {
            popper: {
              className: 'select-bank-account-autocomplete',
            },
          },
        }}
      />
    </FormControl>
  );
};
