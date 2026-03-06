import { Button, ButtonProps } from '@mui/material';
import * as React from 'react';

// const ButtonStatus = (status: string) => <Button size='small' color='primary'> {status} </Button>;
// export default ButtonStatus;



export type IButtonProps = ButtonProps;
const ButtonStyled = ({
    ...props
}: IButtonProps) => {
    return (
      <Button {...props} />
    );
}

export default ButtonStyled;
