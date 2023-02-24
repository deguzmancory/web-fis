import cn from 'classnames';
import React, { useRef } from 'react';
import shortid from 'shortid';
import { BOOLEAN } from 'src/appConfig/constants';
import { View } from '..';
import Element from '../Element';
import './styles.scss';

const RadioButton: React.FC<RadioProps> = ({
  label,
  labelClassName,
  containerClassName,
  style,
  ...props
}) => {
  const id = useRef(shortid.generate());
  return (
    <View isRow className={cn('cmp-radio', containerClassName)} style={style}>
      <input id={id.current} className={cn('cmp-radio__input')} type="radio" {...props} />
      <label htmlFor={id.current} className={cn('cmp-radio__label', labelClassName)}>
        {label}
      </label>
    </View>
  );
};

type RadioProps = React.HTMLProps<HTMLInputElement> & {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
};

const castTrueFalseStringToBoolean = (value: string) => {
  return value === BOOLEAN.true ? true : value === BOOLEAN.false ? false : null;
};

const Group: React.FC<RadioGroupProps> = ({
  options,
  value,
  containerClassName,
  label,
  errorMessage,
  name,
  columns = 3,
  required,
  isTrueFalseOptions = false,
  onBlur,
  onChange = () => {},
  ...props
}) => {
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const data = isTrueFalseOptions ? castTrueFalseStringToBoolean(value) : value;
    onChange(name, data);
  };

  const handleRadioBlur = () => {
    onBlur && onBlur(name, true);
  };

  return (
    <Element
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
      required={required}
    >
      <View isRow align="center" className="pb-8">
        {options?.map((option, index) => (
          <RadioButton
            key={`radio-${name}-${index}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            label={option.label}
            onChange={handleValueChange}
            containerClassName={cn(columns && 'cmp-radio-groups__column')}
            style={{ width: `${100 / columns}%` }}
            onBlur={handleRadioBlur}
            {...props}
          />
        ))}
      </View>
    </Element>
  );
};

type RadioGroupProps = {
  label?: string;
  options?: { value: any; label: string }[];
  value?: any;
  name?: string;
  onChange?: (name: string, value: any) => void;
  errorMessage?: string;
  containerClassName?: string;
  labelClassName?: string;
  description?: string;
  columns?: number;
  disabled?: boolean;
  onBlur?: (name: string, touched: boolean) => void;
  required?: boolean;
  isTrueFalseOptions?: boolean;
};

export default Group;
