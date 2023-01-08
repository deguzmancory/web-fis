import cn from 'classnames';
import React from 'react';
import './styles.scss';

const Tag: React.FC<Props> = ({
  children,
  className,
  size = 'is-normal',
  variant = 'is-primary',
  isLight = false,
  fullWidth,
  backgroundColor,
  color,
  status,
  ...props
}) => {
  return (
    <span
      className={cn('tag', className, variant, size, { 'is-light': isLight })}
      style={{
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: variant === 'is-customize' && backgroundColor ? backgroundColor : '',
        color: variant === 'is-customize' && color ? color : '',
      }}
      id={status}
      {...props}
    >
      {children}
    </span>
  );
};
export type TagVariant =
  | 'is-black'
  | 'is-dark'
  | 'is-light'
  | 'is-white'
  | 'is-primary'
  | 'is-link'
  | 'is-info'
  | 'is-success'
  | 'is-warning'
  | 'is-danger'
  | 'is-customize';
export type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  variant?: TagVariant;
  isLight?: boolean;
  size?: 'is-normal' | 'is-medium' | 'is-large';
  fullWidth?: boolean;
  backgroundColor?: string;
  color?: string;
  className?: string;
  status?: string;
};

export default Tag;
