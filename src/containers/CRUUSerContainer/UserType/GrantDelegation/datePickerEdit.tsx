import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { DatePicker } from 'src/components/common';
import { DateFormat } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CRUUSER_KEY } from '../../enums';
import { CRUUserFormikProps } from '../../helper';

const DatePickerEdit: React.FC<Props> = ({
  data,
  rowIndex,
  keyValue,
  minDate,
  maxDate,
  formikProps,
  fieldName = CRUUSER_KEY.TEMP_DELEGATE_ACCESS,
}) => {
  const { setFieldValue, values } = formikProps;

  // eslint-disable-next-line security/detect-object-injection
  const _keyValue = data[keyValue];

  const [date, setDate] = React.useState(_keyValue);

  const handleDatePickerChange = (name, value: Date) => {
    setDate(value.toUTCString());

    const rows = values.tempDelegateAccess.map((row, index) => {
      return rowIndex === index
        ? {
            ...row,
            [`${keyValue}Temp`]: value.toUTCString(),
          }
        : row;
    });
    setFieldValue(fieldName, rows);
  };

  return data.isEdit ? (
    <>
      <DatePicker
        label={null}
        selected={isEmpty(date) ? null : new Date(date)}
        onChange={handleDatePickerChange}
        minDate={minDate}
        maxDate={maxDate}
      />
    </>
  ) : (
    <Typography variant="body2">
      {_keyValue ? dayjs(_keyValue).format(DateFormat) : '--'}
    </Typography>
  );
};

type Props = {
  data: any;
  rowIndex: number;
  keyValue: string;
  minDate?: Date;
  maxDate?: Date;
  formikProps: CRUUserFormikProps;
  fieldName?: CRUUSER_KEY;
};
export default DatePickerEdit;
