import { Stack } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import TypographyLink from 'src/components/TypographyLink';

import './styles.scss';

const Link: React.FC<Props> = ({
  children,
  className,
  textVariant,
  type = 'default',
  icon,
  ...props
}) => {
  const linkContent = React.useMemo(() => {
    if (type === 'icon-link') {
      return (
        <Stack direction={'row'} alignItems="center">
          {icon}
          <TypographyLink variant={textVariant}>{children}</TypographyLink>
        </Stack>
      );
    }

    if (typeof children === 'string') {
      return <TypographyLink variant={textVariant}>{children}</TypographyLink>;
    }

    return children;
  }, [children, icon, textVariant, type]);

  return (
    <a className={cn('cmp-link', className)} {...props}>
      {linkContent}
    </a>
  );
};

export type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  textVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit';
  type?: 'icon-link' | 'default';
  icon?: React.ReactNode;
};

export default Link;
