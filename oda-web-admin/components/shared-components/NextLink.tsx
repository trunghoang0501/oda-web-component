// React Imports
import React from 'react';
import NLink, { LinkProps } from 'next/link';
import Link, { LinkTypeMap } from '@mui/material/Link';

const NextLink = (
  props: React.PropsWithChildren<LinkProps> &
    LinkTypeMap<{}>['props'] & {
      children: React.ReactElement | string;
    }
) => {
  const { children } = props;

  return (
    <NLink {...props}>
      <Link {...(props as LinkTypeMap<{}>['props'])}>{children}</Link>
    </NLink>
  );
};

export default NextLink;
