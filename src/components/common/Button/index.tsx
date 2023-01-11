import React, { PropsWithChildren, useRef } from 'react';
import cn from 'classnames';

import './styles.scss';
import { Loading } from 'src/components/common';

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  label,
  children,
  className,
  isOutline,
  disabled,
  icon,
  iconPosition = 'left',
  isFull,
  isLoading,
  type = 'button',
  variant = 'primary',
  fontWeightNormal = false,
  onClick = (event) => {},
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const isRenderIcon = !!icon;
  const isDisabled = disabled || isLoading;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick(event);
    handleAddClickEffect();
  };

  const handleAddClickEffect = () => {
    btnRef.current?.classList.remove('cmp-button--effect');
    setTimeout(() => {
      btnRef.current?.classList.add('cmp-button--effect');
    }, 16);
  };

  return (
    <button
      ref={btnRef}
      className={cn('cmp-button', `cmp-button--${variant}`, className, {
        'cmp-button--disabled': isDisabled,
        'cmp-button--full-width': isFull,
        'cmp-button--is-loading': isLoading,
        [`cmp-button__icon--${iconPosition}`]: isRenderIcon,
        [`cmp-button--font-weight-normal`]: fontWeightNormal,
      })}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {isRenderIcon ? icon : null}
      {isLoading && <Loading size="small" loadingStyle={5} className="cmp-button__loading" />}
      <span className="cmp-button__label">{label || children}</span>
    </button>
  );
};

export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'text'
  | 'link'
  | 'link-primary'
  | 'link-danger'
  | 'secondary-outline'
  | 'secondary'
  | 'sorting';

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
  isOutline?: boolean;
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  isFull?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
  fontWeightNormal?: boolean;
};

export default Button;
