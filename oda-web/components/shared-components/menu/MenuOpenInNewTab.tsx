import { Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import NextLink from '../NextLink';

export type ContextMenu = {
  mouseX: number;
  mouseY: number;
} | null;

interface IMenuOpenInNewTabProps {
  contextMenu: ContextMenu;
  newTabLink: string;
  onClose: () => void;
}

export const MenuOpenInNewTab = (props: IMenuOpenInNewTabProps) => {
  const { t } = useTranslation();
  const { contextMenu, onClose, newTabLink } = props;

  return (
    <Menu
      open={contextMenu !== null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >
      <NextLink href={newTabLink} target="_blank" onClick={onClose}>
        <MenuItem>{t('open_link_in_new_tab')}</MenuItem>
      </NextLink>
    </Menu>
  );
};
