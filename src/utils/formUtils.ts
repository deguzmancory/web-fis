import { get } from 'lodash';
import { convertCurrencyInputToString, MoneyInputDetect } from './formatUtils';

export const getUncontrolledInputFieldProps =
  ({ values, setFieldTouched, setFieldValue }) =>
  (name: string, options?: { onBlur: (name, values) => void }) => {
    return {
      name,
      defaultValue: get(values, name),
      onBlur: (event) => {
        const value = event.target.value;

        if (options && options.onBlur) {
          return options.onBlur(name, value);
        }

        setFieldTouched(name, true);
        setFieldValue(name, value);
      },
    };
  };

export const getUncontrolledCurrencyInputFieldProps =
  ({ values, setFieldTouched, setFieldValue }) =>
  (name: string, options?: { onBlur: (name, values) => void }) => {
    return {
      name,
      defaultValue: get(values, name),
      onBlur: (event) => {
        const targetValue = event.target.value;
        const value = MoneyInputDetect(targetValue)
          ? convertCurrencyInputToString(targetValue)
          : targetValue;

        if (options && options.onBlur) {
          return options.onBlur(name, value);
        }

        setFieldTouched(name, true);
        setFieldValue(name, value);
      },
    };
  };
