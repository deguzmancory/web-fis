/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { KeyboardEvent } from 'react';

import { Callback } from 'src/redux/types';

const Form: React.FC<Props> = ({ children, preventDefault = false, customSubmit, ...props }) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (preventDefault && event.key === 'Enter') {
      customSubmit && customSubmit();

      event.preventDefault();
    }
  };

  return (
    <form onKeyDown={handleKeyDown} {...props}>
      {children}
    </form>
  );
};

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
  preventDefault?: boolean;
  customSubmit?: Callback;
};

export default Form;
