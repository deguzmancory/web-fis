import cn from 'classnames';
import React, { useRef, useState } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

import dayjs from 'dayjs';
import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import './styles.scss';

type Week = [Date, Date];

const WeekPicker: React.FC<Props> = ({
  label,
  onChange,
  errorMessage,
  containerClassName,
  classNames,
  placeholder = 'MM/DD/YYYY - MM/DD/YYYY',
  dateFormat = 'MM/DD/YYYY',
  weekSelected,
  ...props
}) => {
  const id = useRef<string>(`datepicker-${getRandomId()}`);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [week, setWeek] = useState<Week>(weekSelected as Week);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleWeekChange = (dates: Week) => {
    setIsOpen(false);
    setSelectedDate(dates[0]);
    onChange(week);
  };

  const handleHoverDay = (event: any) => {
    const dateHovered = dayjs(event);
    const startDate = new Date(dateHovered.clone().weekday(1).toString());
    const endDate = new Date(dateHovered.clone().weekday(7).toString());
    setWeek([startDate, endDate]);
  };

  const fomartDates = (): string => {
    if (isEmpty(weekSelected)) return '';

    return weekSelected?.map((x) => dayjs(x).format(dateFormat as string)).join(' - ') || '';
  };

  const handleClickOutside = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpen(false);
  };

  // For more information:
  // https://reactdatepicker.com/

  const hasError = !isEmpty(errorMessage);
  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={cn('cmp-datepicker', containerClassName)}
    >
      <DatePicker
        id={id.current}
        onChange={handleWeekChange}
        selected={selectedDate}
        placeholderText={placeholder}
        className={cn(
          'cmp-datepicker__input',
          { 'cmp-datepicker__input--error': hasError },
          classNames
        )}
        showPopperArrow={false}
        {...props}
        value={fomartDates()}
        selectsRange
        startDate={week[0]}
        endDate={week[1]}
        open={isOpen}
        showWeekNumbers
        onDayMouseEnter={handleHoverDay}
        onInputClick={() => setIsOpen(true)}
        onClickOutside={handleClickOutside}
      />
    </Element>
  );
};

type Props = ReactDatePickerProps & {
  errorMessage?: string;
  containerClassName?: string;
  classNames?: string;
  placeholder?: string;
  label?: string;
  onChange?: (value: Week) => void;
  weekSelected?: Week;
};

export default WeekPicker;
