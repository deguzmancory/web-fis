import cn from 'classnames';
import React, { HTMLProps, MouseEventHandler, RefObject, useRef } from 'react';

import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import { Icon } from '..';
import Element from '../Element';
import View from '../View';
import './styles.scss';

const TextArea: React.FC<InputProps> = ({
  children,
  errorMessage,
  label,
  className,
  containerClassName,
  inputRef = null,
  iconName = '',
  resize = 'vertical',
  required,
  disabled,
  isUncontrolledInput = false,
  onIconClick,
  ...props
}) => {
  const id = useRef<string>(`text-area-${getRandomId()}`);
  const uncontrolledInputRef = useRef<HTMLTextAreaElement>(undefined);

  if (isUncontrolledInput && uncontrolledInputRef.current) {
    uncontrolledInputRef.current.value = props.defaultValue?.toString();
  }

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
          className={cn(className, 'cmp-text-area', `cmp-text-area__resize--${resize}`, {
            'cmp-text-area--error': !isEmpty(errorMessage),
            'cmp-text-area--disabled': disabled,
          })}
          ref={inputRef ?? (isUncontrolledInput ? uncontrolledInputRef : undefined)}
          disabled={disabled}
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
  label?: string | React.ReactNode;
  required?: boolean;
  resize?: 'horizontal' | 'vertical' | 'bold' | 'none';
  isUncontrolledInput?: boolean;
  onIconClick?: MouseEventHandler<HTMLElement>;
};

export default TextArea;
