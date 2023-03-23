import { TextareaAutosize as MuiTextareaAutosize, TextareaAutosizeProps } from '@mui/material';
import cn from 'classnames';
import React, { MouseEventHandler, RefObject, useRef } from 'react';
import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import { Icon } from '..';
import Element from '../Element';
import View from '../View';
import '../TextArea/styles.scss';

const TextareaAutosize: React.FC<InputProps> = ({
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
  const uncontrolledInputRef = useRef<HTMLTextAreaElement>(null);

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
        <MuiTextareaAutosize
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

export type InputProps = TextareaAutosizeProps & {
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

export default TextareaAutosize;
