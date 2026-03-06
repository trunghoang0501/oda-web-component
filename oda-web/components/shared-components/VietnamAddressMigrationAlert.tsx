import { Alert, AlertProps, Link, useTheme } from '@mui/material';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyModal } from '@/hooks/useMyModal';
import { mediaMobileMax } from '@/utils/constants';
import CompanyAddressValidationModal, {
  AddressValidationModalRef,
} from './CompanyAddressValidationModal';
import PartnerAddressValidationModal, {
  PartnerAddressValidationModalRef,
} from './PartnerAddressValidationModal';
import VietnamAddressMigrationConfirmModal, {
  VietnamAddressMigrationConfirmModalRef,
} from './VietnamAddressMigrationConfirmModal';

export interface VietnamAddressMigrationAlertProps extends AlertProps {
  onOpenCompanyAddress?: () => void;
  onOpenPartnerAddress?: () => void;
  onOpenConfirmSwitch?: () => void;
}

const VietnamAddressMigrationAlert: React.FC<
  VietnamAddressMigrationAlertProps
> = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { confirmInfo } = useMyModal();
  const modalRef = useRef<AddressValidationModalRef>(null);
  const partnerModalRef = useRef<PartnerAddressValidationModalRef>(null);
  const confirmModalRef = useRef<VietnamAddressMigrationConfirmModalRef>(null);

  const {
    onOpenCompanyAddress,
    onOpenPartnerAddress,
    onOpenConfirmSwitch,
    sx,
    ...alertProps
  } = props;

  const handleOpenCompany = () => {
    if (onOpenCompanyAddress) return onOpenCompanyAddress();

    // Open the address validation modal instead of simple confirmInfo
    modalRef.current?.open();
  };

  const handleOpenPartner = () => {
    if (onOpenPartnerAddress) return onOpenPartnerAddress();
    partnerModalRef.current?.open();
  };

  const handleOpenConfirm = () => {
    if (onOpenConfirmSwitch) return onOpenConfirmSwitch();

    // Open the confirmation modal instead of simple confirmInfo
    confirmModalRef.current?.open();
  };

  return (
    <>
      <Alert
        severity="warning"
        sx={{
          mb: theme.spacing(8),
          border: `1px solid ${theme.palette.warning.main}`,
          '& a': { fontWeight: 600, cursor: 'pointer' },
          [mediaMobileMax]: {
            '& *': { fontSize: `${theme.spacing(3.5)} !important` },
          },
          ...sx,
        }}
        {...alertProps}
      >
        {/* Text mirrors the screenshot and contains three actionable links */}
        {t('vietnam_address_migration_alert_text')}{' '}
        <Link onClick={handleOpenCompany} underline="hover">
          {t('company_address')}
        </Link>
        ,{' '}
        <Link onClick={handleOpenPartner} underline="hover">
          {t('partner_address')}
        </Link>
        , and{' '}
        <Link onClick={handleOpenConfirm} underline="hover">
          {t('confirm_the_switch_to_the_new_format')}
        </Link>{' '}
        {t('after_vietnam_s_administrative_merger')}
      </Alert>

      <CompanyAddressValidationModal ref={modalRef} />
      <PartnerAddressValidationModal ref={partnerModalRef} />
      <VietnamAddressMigrationConfirmModal
        ref={confirmModalRef}
        openCompany={handleOpenCompany}
        openPartner={handleOpenPartner}
      />
    </>
  );
};

export default React.memo(VietnamAddressMigrationAlert);
