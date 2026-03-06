import { SvgIcon, SvgIconProps } from '@mui/material';
import * as React from 'react';

function ArrowDownIcon(props: SvgIconProps) {
  const { color } = props;
  return (
    <SvgIcon width="10" height="5" viewBox="0 0 10 5" {...props}>
      <path d="M10 5.5L5 0.5L0 5.5L10 5.5Z" fill={color ?? '#908BA5'} />
    </SvgIcon>
  );
}

export default ArrowDownIcon;
