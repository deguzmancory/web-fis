import { Typography } from '@mui/material';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'src/validations';
import { Button, Checkbox, View } from '../common';
import './styles.scss';

export const CheckBoxFilter: React.FC<CheckboxProps> = ({
  label,
  options,
  onChange,
  value,
  name,
  errorMessage,
}) => {
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(isEmpty(value));
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const allValue = options.map((x) => x.value);

  useEffect(() => {
    if (value.length === allValue.length && !isEmpty(allValue.length)) {
      setIsSelectAll(true);
      setIsChecked(true);
    } else {
      setIsSelectAll(false);
      setIsChecked(false);
    }
  }, [allValue.length, isSelectAll, value]);

  const handleSelectAll = () => {
    if (isChecked) {
      onChange(name, []);
    } else {
      onChange(name, allValue);
    }
    setIsChecked((prev) => !prev);
  };
  return (
    <View className="cmp-filter-checkbox">
      <View
        className={cn('mb-8 cmp-filter-checkbox__label', { 'is-expanded': isExpanded })}
        isRow
        align="center"
        justify="space-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Title - Select All */}
        <Typography variant="h5">{label}</Typography>
        <Button variant="link" onClick={handleSelectAll}>
          {!isSelectAll ? 'Select All' : 'Deselect All'}
        </Button>
      </View>

      {/* List Checkbox */}
      <View className="cmp-filter-checkbox__menu">
        <View className="cmp-filter-checkbox__menu__checkbox" fullWidth>
          <Checkbox.Group
            label={null}
            options={options}
            name={name}
            onChange={onChange}
            errorMessage={errorMessage}
            value={value}
            columns={1}
            isGetStringValue
          />
        </View>
      </View>
    </View>
  );
};

type CheckboxProps = {
  label?: string;
  options?: { value: any; label: string; key?: string }[];
  value?: any[];
  name?: string;
  onChange?: (...arg: any[]) => void;
  errorMessage?: string;
};
