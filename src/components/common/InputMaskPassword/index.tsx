/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from 'classnames';
import React, { HTMLProps, RefObject, useRef, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import InputMask from 'react-input-mask';
import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import { InputIcon } from '../Input';
import '../Input/styles.scss';
import View from '../View';

const InputMaskPassword: React.FC<InputProps> = ({
  children,
  errorMessage,
  label,
  className,
  subLabel,
  containerClassName,
  inputRef = null,
  mask = '***',
  maskChar = null,
  hideIconError,
  required,
  infoTooltipMessage,
  infoTooltipPlacement,
  infoToolTipWithArrow,
  ...props
}) => {
  //   9: 0-9
  //   a: A-Z, a-z
  //   *: A-Z, a-z, 0-9
  const id = useRef<string>(`input-${getRandomId()}`);
  const [hidden, setHidden] = useState<boolean>(true);

  const toggleEye = () => setHidden((prev) => !prev);

  const inputType = hidden ? 'password' : 'text';
  const iconComponent = hidden ? <AiFillEye /> : <AiFillEyeInvisible />;

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
            'cmp-input--icon': true,
          })}
          mask={mask}
          maskChar={maskChar}
          ref={inputRef}
          type={inputType}
          {...props}
        />
        {!hideIconError && (
          <InputIcon
            {...{
              iconName: null,
              iconComponent,
              errorMessage,
              isIconPositionLeft: true,
              onIconClick: toggleEye,
            }}
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
  label?: string | React.ReactNode;
  iconName?: string;
  mask: string;
  maskChar?: string;
  required?: boolean;
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

export default InputMaskPassword;
