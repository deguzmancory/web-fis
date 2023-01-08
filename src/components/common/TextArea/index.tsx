import cn from 'classnames';
import React, { HTMLProps, MouseEventHandler, RefObject, useRef } from 'react';

import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import { Icon } from '..';
import Element from '../Element';
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
  onIconClick,
  required,
  ...props
}) => {
  const id = useRef<string>(`text-area-${getRandomId()}`);

  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
      required={required}
    >
      <View>
        <textarea
          id={id.current}
          className={cn(className, 'cmp-text-area', {
            'cmp-text-area--error': !isEmpty(errorMessage),
          })}
          ref={inputRef}
          {...props}
        />
        {iconName && <Icon name={iconName} className="cmp-text-area__icon" onClick={onIconClick} />}
      </View>
    </Element>
  );
};

type BaseInputProps = Pick<
  HTMLProps<HTMLTextAreaElement>,
  Exclude<keyof HTMLProps<HTMLTextAreaElement>, 'label'>
>;
export type InputProps = BaseInputProps & {
  errorMessage?: string;
  containerClassName?: string;
  inputRef?: RefObject<HTMLTextAreaElement>;
  iconName?: string;
  onIconClick?: MouseEventHandler<HTMLElement>;
  label?: string | React.ReactNode;
  required?: boolean;
};

export default Input;
