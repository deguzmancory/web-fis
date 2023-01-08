import React from 'react';
import cn from 'classnames';

import './styles.scss';
import Element from '../Element';

const ButtonYesNo: React.FC<Props> = ({
  value = null,
  onChange,
  label,
  errorMessage,
  containerClassName,
  required,
  name,
  noTitle,
  yesTitle,
  disabled,
  onBlur,
  ...props
}) => {
  const state = value;
  const handleResetValue = () => {
    // setState(null);
    onChange(name, null);
  };

  const handleClickYes = () => {
    if (state !== true) {
      // setState(true);
      onChange(name, true);
    } else handleResetValue();
  };

  const handleClickNo = () => {
    if (state !== false) {
      // setState(false);
      onChange(name, false);
    } else handleResetValue();
  };

  const handleBlur = () => {
    onBlur(name, true);
  };

  return (
    <Element
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
      required={required}
    >
      <div
        className={cn('cmp-btn-yes-no', { 'cmp-btn-yes-no--disabled': disabled })}
        onBlur={handleBlur}
      >
        <button
          className={cn(
            'cmp-btn-yes-no__button',
            { 'is-active': state === true },
            { 'is-expand': yesTitle }
          )}
          onClick={handleClickYes}
          type="button"
          name={name}
          {...props}
        >
          <span className="cmp-btn-yes-no__label">{yesTitle || 'YES'}</span>
        </button>
        <button
          className={cn(
            'cmp-btn-yes-no__button',
            { 'is-active': state === false },
            { 'is-expand': noTitle }
          )}
          onClick={handleClickNo}
          type="button"
          name={name}
          {...props}
        >
          <span className="cmp-btn-yes-no__label">{noTitle || 'NO'}</span>
        </button>
      </div>
    </Element>
  );
};

type Props = {
  value: boolean | null;
  name?: string;
  yesTitle?: string;
  noTitle?: string;
  onChange: (...args: any[]) => void;
  onBlur: (...args: any[]) => void;
  label?: string | React.ReactNode;
  containerClassName?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
};

export default ButtonYesNo;
