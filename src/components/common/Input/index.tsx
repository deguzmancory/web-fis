import cn from 'classnames';
import React, { HTMLProps, MouseEventHandler, RefObject, useRef } from 'react';

import { IconButton } from '@mui/material';
import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import Icon from '../Icon';
import View from '../View';
import './styles.scss';

const Input: React.FC<InputProps> = ({
  children,
  errorMessage,
  label,
  className,
  containerClassName,
  inputRef = null,
  iconName = '',
  iconComponent,
  iconPosition = 'right',
  subLabel,
  required,
  hideIconError = false,
  infoTooltipMessage,
  infoTooltipPlacement,
  infoToolTipWithArrow,
  customIcon = null,
  onIconClick,
  ...props
}) => {
  const id = useRef<string>(`input-${getRandomId()}`);
  const isIconPositionLeft = iconPosition === 'left';

  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
      subLabel={subLabel}
      required={required}
      infoTooltipMessage={infoTooltipMessage}
      infoTooltipPlacement={infoTooltipPlacement}
      infoToolTipWithArrow={infoToolTipWithArrow}
    >
      <View>
        <input
          id={id.current}
          className={cn(
            className,
            'cmp-input',
            {
              'cmp-input--error': !isEmpty(errorMessage),
            },
            {
              'cmp-input--icon': !isEmpty(iconName || customIcon),
            },
            {
              left: isIconPositionLeft,
            }
          )}
          ref={inputRef}
          placeholder={props.placeholder}
          {...props}
        />
        {!hideIconError && (
          <InputIcon
            {...{ iconName, iconComponent, errorMessage, isIconPositionLeft, onIconClick }}
          />
        )}
        {customIcon}
      </View>
    </Element>
  );
};

export const InputIcon = ({ iconName, iconComponent, isIconPositionLeft, onIconClick }) => {
  switch (true) {
    case !isEmpty(iconComponent):
      return (
        <IconButton onClick={onIconClick} classes={{ root: 'cmp-input__icon p-0' }}>
          {iconComponent}
          <span
            style={{
              display: 'none',
            }}
          >
            Icon Input Label
          </span>
        </IconButton>
      );
    case !isEmpty(iconName):
      return (
        <Icon
          name={iconName}
          className={cn('cmp-input__icon', {
            left: isIconPositionLeft,
          })}
          onClick={onIconClick}
        />
      );
    default:
      return null;
  }
};

type BaseInputProps = Pick<
  HTMLProps<HTMLInputElement>,
  Exclude<keyof HTMLProps<HTMLInputElement>, 'label'>
>;
export type InputProps = BaseInputProps & {
  errorMessage?: string;
  containerClassName?: string;
  inputRef?: RefObject<HTMLInputElement>;
  subLabel?: string | React.ReactNode;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  onIconClick?: MouseEventHandler<HTMLElement>;
  label?: string | React.ReactNode;
  required?: boolean;
  iconComponent?: React.ReactNode;
  hideIconError?: boolean;
  customIcon?: React.ReactElement;
  infoTooltipMessage?: string;
  infoTooltipPlacement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  infoToolTipWithArrow?: boolean;
};

export default Input;
