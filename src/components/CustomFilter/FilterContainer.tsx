import cn from 'classnames';
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Callback } from 'src/redux/types';
import { isEmpty } from 'src/validations';
import { Button, Text, View } from '../common';
import { ButtonVariant } from '../common/Button';
import MuiPopOverFilter from '../MuiPopOverFilter';
import './styles.scss';

export const FilterContainer: React.FC<ContainerProps> = ({
  clearVariant = 'text',
  onApply,
  onClear,
  filterForm,
}) => {
  const [isShow, setIsShow] = useState<boolean>(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const filter = query.getAll('filter') as string[];

  const isHasFilter = !isEmpty(filter) && !isEmpty(filter.filter((x) => x));

  const handleApply = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsShow(false);
    onApply();
  };
  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClear();
  };

  return (
    <MuiPopOverFilter
      isShow={isShow}
      onShow={setIsShow}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      label={
        <View
          isRowWrap
          align="center"
          className={cn(
            'cmp-filter-container__label',
            { 'is-focus': isShow },
            { 'is-filter': isHasFilter }
          )}
        >
          <FaFilter className="cmp-filter-icon__icon" color={COLOR_CODE.INFO} />
          <Text size={14} className="has-text-link ml-8">
            {'Filter'}
          </Text>
        </View>
      }
      body={
        <View className="cmp-filter-container__form">
          {filterForm}
          <View isRowWrap justify="flex-end" className="pb-16">
            <Button label="Clear" variant={clearVariant} onClick={handleClear} className="px-12" />
            <Button label="Apply" onClick={handleApply} className="ml-16" />
          </View>
        </View>
      }
    />
  );
};

type ContainerProps = {
  onApply: Callback;
  onClear: Callback;
  clearVariant?: ButtonVariant;
  filterForm: React.ReactNode;
};
