import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { DatePicker } from 'src/components/common';
import { DateFormat } from 'src/utils/momentUtils';
import { CRUUSER_KEY } from '../../enums';
import { CRUUserFormikProps } from '../../helper';

const DatePickerEdit: React.FC<Props> = ({
  data,
  rowIndex,
  value,
  tempValue,
  minDate,
  maxDate,
  formikProps,
}) => {
  const { setFieldValue } = formikProps;

  // eslint-disable-next-line security/detect-object-injection
  const _keyValue = data[tempValue] || data[value];

  const handleDatePickerChange = (_name, value: Date) => {
    setFieldValue(`${CRUUSER_KEY.DELEGATE_ACCESS}[${rowIndex}].${tempValue}`, value);
  };

  return data.isEdit ? (
    <DatePicker
      label={null}
      selected={_keyValue ? new Date(_keyValue) : null}
      onChange={handleDatePickerChange}
      minDate={minDate}
      maxDate={maxDate}
    />
  ) : (
    <Typography variant="body2">
      {_keyValue ? dayjs(_keyValue).format(DateFormat) : '--'}
    </Typography>
  );
};

type Props = {
  data: any;
  rowIndex: number;
  value: string;
  tempValue: string;
  minDate?: Date;
  maxDate?: Date;
  formikProps: CRUUserFormikProps;
};
export default DatePickerEdit;
