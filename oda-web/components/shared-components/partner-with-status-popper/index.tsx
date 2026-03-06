import { Tab, Tabs } from '@mui/material';
import React, { ReactNode, SyntheticEvent } from 'react';
import {
  PARTNER_STATUS_TAB_CLASS_NAME,
  STATUS_TABS,
  StatusTabEnum,
} from './constants';
import { BoxPaperContentStyled, PaperStyled } from './styles';

export interface IPartnerWithStatusPopperProps {
  children: ReactNode;
  activeTab: StatusTabEnum;
  setActiveTab: (tab: StatusTabEnum) => void;
}

const PartnerWithStatusPopper = (props: IPartnerWithStatusPopperProps) => {
  const { children, activeTab, setActiveTab } = props;

  const handleChangeTab = (event: SyntheticEvent, value: StatusTabEnum) => {
    setActiveTab(value);
  };

  return (
    <PaperStyled>
      <BoxPaperContentStyled>
        <Tabs value={activeTab} onChange={handleChangeTab}>
          {STATUS_TABS.map((tab) => (
            <Tab
              className={PARTNER_STATUS_TAB_CLASS_NAME}
              key={tab.value}
              label={tab.name}
            />
          ))}
        </Tabs>
        {children}
      </BoxPaperContentStyled>
    </PaperStyled>
  );
};

export default PartnerWithStatusPopper;
