import cn from 'classnames';
import React, { useRef } from 'react';
import shortid from 'shortid';
import { BOOLEAN } from 'src/appConfig/constants';
import { Button, View } from '..';
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
  showClearButton,
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

  const handleClear = () => {
    onChange && onChange(name, null);
  };

  return (
    <Element
      errorMessage={errorMessage}
      label={label}
      subLabel={subLabel}
      className={containerClassName}
      subContentLabel={
        showClearButton &&
        !!label &&
        !!value && (
          <Button
            variant="link"
            style={{
              padding: '0 4px',
              height: 20,
              fontSize: 12,
            }}
            onClick={handleClear}
          >
            Clear
          </Button>
        )
      }
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
      {showClearButton && !label && !!value && (
        <Button
          variant="link"
          style={{
            padding: '4px',
            height: 20,
            fontSize: 12,
            maxWidth: '50px',
          }}
          onClick={handleClear}
        >
          Clear
        </Button>
      )}
    </Element>
  );
};

export type RadioGroupOptions = { value: any; label: string; subLabel?: React.ReactNode }[];

type RadioGroupProps = {
  label?: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
  options?: RadioGroupOptions;
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
  showClearButton?: boolean;
  handleClear?: (name: string, value: any) => void;
  onChange?: (name: string, value: any) => void;
  onBlur?: (name: string, touched: boolean) => void;
};

export default Group;
