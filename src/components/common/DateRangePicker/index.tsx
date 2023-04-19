import cn from 'classnames';
import React, { useRef, useState } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

import dayjs from 'dayjs';
import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import './styles.scss';

export type DateRange = [Date, Date];

const DateRangePicker: React.FC<Props> = ({
  label,
  name,
  errorMessage,
  containerClassName,
  classNames,
  placeholder = 'MM/DD/YYYY - MM/DD/YYYY',
  dateFormat = 'MM/DD/YYYY',
  selecteds,
  monthsShown = 2,
  positionFixed = true,
  showYearDropdown = true,
  showMonthDropdown = true,
  scrollableYearDropdown = true,
  onChange,
  ...props
}) => {
  const id = useRef<string>(`datepicker-${getRandomId()}`);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dates, setDates] = useState<DateRange>(selecteds as DateRange);

  const handleDateChange = (dates: DateRange) => {
    setDates(dates);

    if (!!dates[0] && !!dates[1]) {
      setIsOpen(false);
      onChange(name, dates);
    }
  };

  const formatDates = (): string => {
    if (isEmpty(selecteds)) return '';

    return selecteds?.map((x) => dayjs(x).format(dateFormat as string)).join(' - ') || '';
  };

  const handleClickOutside = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpen(false);
  };

  // For more information:
  // https://reactdatepicker.com/

  const hasError = !isEmpty(errorMessage);
  const startDate = dates?.[0];
  const endDate = dates?.[1];

  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={cn('cmp-datepicker', containerClassName)}
    >
      <DatePicker
        id={id.current}
        onChange={handleDateChange}
        placeholderText={placeholder}
        className={cn(
          'cmp-datepicker__input',
          { 'cmp-datepicker__input--error': hasError },
          classNames
        )}
        showPopperArrow={false}
        {...props}
        value={formatDates()}
        selectsRange
        startDate={startDate}
        endDate={endDate}
        open={isOpen}
        onInputClick={() => setIsOpen(true)}
        onClickOutside={handleClickOutside}
        popperProps={{
          positionFixed: positionFixed,
        }}
        disabledKeyboardNavigation
        monthsShown={monthsShown}
        showYearDropdown={showYearDropdown}
        showMonthDropdown={showMonthDropdown}
        scrollableYearDropdown={scrollableYearDropdown}
        dropdownMode="select"
        yearDropdownItemNumber={15}
        portalId="root"
      />
    </Element>
  );
};

type Props = Omit<ReactDatePickerProps, 'onChange'> & {
  errorMessage?: string;
  containerClassName?: string;
  classNames?: string;
  placeholder?: string;
  label?: string;
  selecteds?: [Date, Date];
  positionFixed?: boolean;
  monthsShown?: number;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  scrollableYearDropdown?: boolean;
  onChange?: (name: string, value: DateRange) => void;
};

export default DateRangePicker;
