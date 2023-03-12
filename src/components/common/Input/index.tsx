import { Box, IconButton } from '@mui/material';
import cn from 'classnames';
import React, { HTMLProps, MouseEventHandler, RefObject, useRef } from 'react';
import { getRandomId } from 'src/utils';
import { CommonPlacement } from 'src/utils/commonTypes';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import Icon from '../Icon';
import View from '../View';
import EllipsisTooltipBaseInput, {
  EllipsisTooltipBaseInputProps,
} from '../EllipsisTooltipBaseInput';

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
  footer,
  hideArrowTypeNumber = false,
  isUncontrolledInput = false,
  onIconClick,
  ...props
}) => {
  const id = useRef<string>(`input-${getRandomId()}`);
  const uncontrolledInputRef = useRef<HTMLInputElement>(undefined);
  const isIconPositionLeft = iconPosition === 'left';

  if (!inputRef && isUncontrolledInput && uncontrolledInputRef.current) {
    uncontrolledInputRef.current.value = props.defaultValue?.toString();
  }

  if (inputRef && inputRef.current && isUncontrolledInput) {
    inputRef.current.value = props.defaultValue?.toString();
  }

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
              'cmp-input--hide-arrows': hideArrowTypeNumber,
            },
            {
              left: isIconPositionLeft,
            }
          )}
          ref={inputRef ?? (isUncontrolledInput ? uncontrolledInputRef : undefined)}
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
      {footer && <Box mt={1}>{footer}</Box>}
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

export const EllipsisTooltipInput: React.FC<EllipsisTooltipInputProps> = ({ ...props }) => {
  return (
    <EllipsisTooltipBaseInput {...props}>
      <Input />
    </EllipsisTooltipBaseInput>
  );
};

export type EllipsisTooltipInputProps = EllipsisTooltipBaseInputProps & InputProps;

type BaseInputProps = Pick<
  HTMLProps<HTMLInputElement>,
  Exclude<keyof HTMLProps<HTMLInputElement>, 'label'>
>;
export type InputProps = BaseInputProps & {
  errorMessage?: string;
  containerClassName?: string;
  inputRef?: RefObject<HTMLInputElement>;
  subLabel?: string | React.ReactNode;
  footer?: string | React.ReactNode;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  label?: string | React.ReactNode;
  required?: boolean;
  iconComponent?: React.ReactNode;
  hideIconError?: boolean;
  customIcon?: React.ReactElement;
  infoTooltipMessage?: string;
  infoTooltipPlacement?: CommonPlacement;
  infoToolTipWithArrow?: boolean;
  hideArrowTypeNumber?: boolean;
  isUncontrolledInput?: boolean;
  onIconClick?: MouseEventHandler<HTMLElement>;
};

export default Input;
