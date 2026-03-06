import { Tab, Tabs } from '@mui/material';
import React, { ReactNode, SyntheticEvent } from 'react';
import { PaperStyled } from '@/components/shared-components/partner-with-status-popper/styles';
import {
  LOCAL_AND_LINKED_PARTNER_TAB_CLASS_NAME,
  PartnerTabEnum,
  STATUS_TABS,
} from '../constants';
import { BoxPaperContentStyled } from '../styles';

export interface ILocalAndLinkedPartnerPopperProps {
  children: ReactNode;
  activeTab: PartnerTabEnum;
  setActiveTab: (tab: PartnerTabEnum) => void;
}

export const LocalAndLinkedPartnerPopper = (
  props: ILocalAndLinkedPartnerPopperProps
) => {
  const { children, activeTab, setActiveTab } = props;

  const handleChangeTab = (event: SyntheticEvent, value: PartnerTabEnum) => {
    setActiveTab(value);
  };

  return (
    <PaperStyled>
      <BoxPaperContentStyled>
        <Tabs value={activeTab} onChange={handleChangeTab}>
          {STATUS_TABS.map((tab) => (
            <Tab
              className={LOCAL_AND_LINKED_PARTNER_TAB_CLASS_NAME}
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
