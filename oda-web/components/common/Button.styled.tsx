import { Button, ButtonProps } from '@mui/material';
import * as React from 'react';

export type IButtonProps = ButtonProps;
const ButtonStyled = ({ ...props }: IButtonProps) => {
  return <Button {...props} />;
};

export default ButtonStyled;
