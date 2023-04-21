import { Stack, SxProps } from '@mui/material';
import cn from 'classnames';
import { AnchorHTMLAttributes, DetailedHTMLProps, FC, ReactNode, useMemo } from 'react';
import TypographyLink from 'src/components/TypographyLink';

import './styles.scss';

const Link: FC<Props> = ({
  children,
  className,
  textVariant,
  type = 'default',
  icon,
  textSx,
  ...props
}) => {
  const linkContent = useMemo(() => {
    if (type === 'icon-link') {
      return (
        <Stack direction={'row'} alignItems="center">
          {icon}
          <TypographyLink variant={textVariant} sx={textSx}>
            {children}
          </TypographyLink>
        </Stack>
      );
    }

    if (typeof children === 'string') {
      return (
        <TypographyLink variant={textVariant} sx={textSx}>
          {children}
        </TypographyLink>
      );
    }

    return children;
  }, [children, icon, textVariant, type, textSx]);

  return (
    <a className={cn('cmp-link', className)} {...props}>
      {linkContent}
    </a>
  );
};

export type Props = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
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
  icon?: ReactNode;
  textSx?: SxProps;
};

export default Link;
