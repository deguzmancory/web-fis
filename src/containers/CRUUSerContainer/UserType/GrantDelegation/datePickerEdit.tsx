import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { DatePicker } from 'src/components/common';
import { Callback } from 'src/redux/types';
import { DateFormat } from 'src/utils/momentUtils';

const DatePickerEdit: React.FC<Props> = ({ data, setRows, rowIndex, keyValue }) => {
  // eslint-disable-next-line security/detect-object-injection
  const _keyValue = data[keyValue];

  const [date, setDate] = React.useState(_keyValue);

  const handleDatePickerChange = (name, value: Date) => {
    setDate(value.toISOString());

    setRows((prevRows) => {
      return prevRows.map((row, index) => {
        return rowIndex === index
          ? {
              ...row,
              [`${keyValue}Temp`]: value.toISOString(),
            }
          : row;
      });
    });
  };

  return data.isEdit ? (
    <>
      <DatePicker label={null} selected={new Date(date)} onChange={handleDatePickerChange} />
    </>
  ) : (
    <Typography variant="body2">
      {_keyValue ? dayjs(_keyValue).format(DateFormat) : '--'}
    </Typography>
  );
};

type Props = {
  data: any;
  setRows: Callback;
  rowIndex: number;
  keyValue: string;
};
export default DatePickerEdit;
