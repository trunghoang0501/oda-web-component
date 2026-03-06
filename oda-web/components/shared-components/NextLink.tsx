import Link, { LinkTypeMap } from '@mui/material/Link';
import NLink, { LinkProps } from 'next/link';
import React from 'react';

const NextLink = (
  props: React.PropsWithChildren<LinkProps> &
    LinkTypeMap<{}>['props'] & {
      children: React.ReactElement | string;
      disabled?: boolean;
    }
) => {
  const { children, disabled } = props;

  return disabled ? (
    <>{children}</>
  ) : (
    <NLink {...props}>
      <Link
        onContextMenu={(event) => event.stopPropagation()}
        {...(props as LinkTypeMap<{}>['props'])}
      >
        {children}
      </Link>
    </NLink>
  );
};

export default NextLink;
