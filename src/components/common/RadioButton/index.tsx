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
  subLabel,
  ...props
}) => {
  const id = useRef(shortid.generate());
  return (
    <View isRow className={cn('cmp-radio', containerClassName)} style={style}>
      <input id={id.current} className={cn('cmp-radio__input')} type="radio" {...props} />
      <label htmlFor={id.current} className={cn('cmp-radio__label', labelClassName)}>
        {label}
      </label>
      {subLabel && subLabel}
    </View>
  );
};

type RadioProps = React.HTMLProps<HTMLInputElement> & {
  label?: string;
  subLabel?: React.ReactNode;
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
  subLabel,
  errorMessage,
  name,
  columns = 3,
  required,
  isTrueFalseOptions = false,
  itemStyle,
  itemClassName,
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
      subLabel={subLabel}
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
            containerClassName={cn(itemClassName, columns && 'cmp-radio-groups__column')}
            style={{ width: `${100 / columns}%`, ...itemStyle }}
            onBlur={handleRadioBlur}
            subLabel={option.subLabel}
            {...props}
          />
        ))}
      </View>
    </Element>
  );
};

type RadioGroupProps = {
  label?: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
  options?: { value: any; label: string; subLabel?: React.ReactNode }[];
  value?: any;
  name?: string;
  errorMessage?: string;
  containerClassName?: string;
  labelClassName?: string;
  description?: string;
  columns?: number;
  disabled?: boolean;
  required?: boolean;
  isTrueFalseOptions?: boolean;
  itemStyle?: React.CSSProperties;
  itemClassName?: string;
  onChange?: (name: string, value: any) => void;
  onBlur?: (name: string, touched: boolean) => void;
};

export default Group;
