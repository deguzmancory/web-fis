/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from 'classnames';
import React, { HTMLProps, MouseEventHandler, RefObject, useRef } from 'react';
import InputMask from 'react-input-mask';
import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import { InputIcon } from '../Input';
import '../Input/styles.scss';
import View from '../View';

const Input: React.FC<InputProps> = ({
  children,
  errorMessage,
  label,
  className,
  subLabel,
  containerClassName,
  inputRef = null,
  onIconClick,
  iconName = null,
  mask = '***',
  maskChar = null,
  hideIconError,
  required,
  iconComponent,
  infoTooltipMessage,
  infoTooltipPlacement,
  infoToolTipWithArrow,
  ...props
}) => {
  //   9: 0-9
  //   a: A-Z, a-z
  //   *: A-Z, a-z, 0-9
  const id = useRef<string>(`input-${getRandomId()}`);

  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      subLabel={subLabel}
      required={required}
      className={containerClassName}
      infoTooltipMessage={infoTooltipMessage}
      infoTooltipPlacement={infoTooltipPlacement}
      infoToolTipWithArrow={infoToolTipWithArrow}
    >
      <View>
        <InputMask
          id={id.current}
          className={cn(className, 'cmp-input', {
            'cmp-input--error': !isEmpty(errorMessage),
            'cmp-input--icon': !!iconName,
          })}
          mask={mask}
          maskChar={maskChar}
          ref={inputRef}
          {...props}
        />
        {!hideIconError && (
          <InputIcon
            {...{ iconName, iconComponent, errorMessage, isIconPositionLeft: true, onIconClick }}
          />
        )}
      </View>
    </Element>
  );
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
  onIconClick?: MouseEventHandler<HTMLElement>;
  label?: string | React.ReactNode;
  iconName?: string;
  mask: string;
  maskChar?: string;
  required?: boolean;
  iconComponent?: React.ReactNode;
  hideIconError?: boolean;
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
