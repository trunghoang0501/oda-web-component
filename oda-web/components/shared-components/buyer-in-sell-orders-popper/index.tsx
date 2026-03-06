import { Tab, Tabs } from '@mui/material';
import React, { ReactNode, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { PARTNER_STATUS_TAB_CLASS_NAME } from '@/components/shared-components/partner-with-status-popper/constants';
import {
  BoxPaperContentStyled,
  PaperStyled,
} from '@/components/shared-components/partner-with-status-popper/styles';
import { VendorStatusEnum } from '@/types';

export interface BuyerVendorPopperProps {
  children: ReactNode;
  status: VendorStatusEnum;
  setStatus: (tab: VendorStatusEnum) => void;
}

const BuyerVendorPopper = (props: BuyerVendorPopperProps) => {
  const { t } = useTranslation();
  const { children, status, setStatus } = props;
  const handleChangeTab = (event: SyntheticEvent, value: any) => {
    setStatus(
      value.toString() === '0'
        ? VendorStatusEnum.LOCAL
        : VendorStatusEnum.LINKED
    );
  };

  return (
    <PaperStyled>
      <BoxPaperContentStyled>
        <Tabs
          value={status === VendorStatusEnum.LOCAL ? 0 : 1}
          onChange={handleChangeTab}
        >
          {['local', 'linked'].map((value) => (
            <Tab
              className={PARTNER_STATUS_TAB_CLASS_NAME}
              key={value}
              label={t(value)}
            />
          ))}
        </Tabs>
        {children}
      </BoxPaperContentStyled>
    </PaperStyled>
  );
};

export default BuyerVendorPopper;
