import cn from 'classnames';
import React from 'react';

import './styles.scss';

const Link: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <a className={cn('cmp-link', className)} {...props}>
      {children}
    </a>
  );
};

export type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {};

export default Link;
