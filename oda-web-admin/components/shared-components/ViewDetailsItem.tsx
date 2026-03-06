import HorizontalSelectItem from '@/components/shared-components/horizontal-select-item';
import React, { ReactElement, useRef } from 'react';
import { equals } from 'rambda';
import { useTranslation } from 'react-i18next';
import FormDialog, {
  FormDialogRef,
} from '@/components/shared-components/modal-dialog';

// ** MUI Components
import { FormContainer } from 'react-hook-form-mui';
import { Button, DialogActions, Typography } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useTheme } from '@mui/material/styles';

type IViewDetailsItemProps = {
  label: string;
  value?: string;
  rightComponent?: () => ReactElement;
};

const RoleItem = ({ label, value, rightComponent }: IViewDetailsItemProps) => {
  // Translation
  const [t] = useTranslation();

  const theme = useTheme();

  return (
    <HorizontalSelectItem
      label={label}
      value={value}
      rightComponent={rightComponent}
    />
  );
};

export default React.memo(RoleItem, equals);
