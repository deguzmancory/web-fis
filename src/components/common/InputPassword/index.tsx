import React, { useState } from 'react';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Input } from '..';
import { InputProps } from '../Input';
import './styles.scss';

const InputPassword: React.FC<Props> = (props) => {
  const [hidden, setHidden] = useState<boolean>(true);

  const toggleEye = () => setHidden((prev) => !prev);

  const inputType = hidden ? 'password' : 'text';
  const iconName = hidden ? <AiFillEye /> : <AiFillEyeInvisible />;

  return <Input {...props} type={inputType} iconComponent={iconName} onIconClick={toggleEye} />;
};

type Props = InputProps;

export default InputPassword;
