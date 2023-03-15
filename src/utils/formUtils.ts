import { get } from 'lodash';
import { CommonFormikProps } from './commonTypes';
import { convertCurrencyInputToString, MoneyInputDetect } from './formatUtils';
import { isEqualPrevAndNextObjByPath } from './handlerUtils';

export const getUncontrolledInputFieldProps =
  ({ values, setFieldTouched, setFieldValue }) =>
  (name: string, options?: { onBlur: (name, value) => void }) => {
    return {
      name,
      defaultValue: get(values, name),
      isUncontrolledInput: true,
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
  (name: string, options?: { onBlur: (name, value) => void }) => {
    return {
      name,
      defaultValue: get(values, name),
      isUncontrolledInput: true,
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

export const isEqualPrevAndNextFormikValues = <TFormValue = any>({
  formKeysNeedRender,
  prevFormikProps,
  nextFormikProps,
}: {
  formKeysNeedRender: string[];
  prevFormikProps: CommonFormikProps<TFormValue>;
  nextFormikProps: CommonFormikProps<TFormValue>;
}) => {
  const {
    values: prevFormikValues,
    errors: prevFormikErrors,
    touched: prevFormikTouched,
  } = prevFormikProps;
  const {
    values: nextFormikValues,
    errors: nextFormikErrors,
    touched: nextFormikTouched,
  } = nextFormikProps;

  return formKeysNeedRender.every(
    (key) =>
      isEqualPrevAndNextObjByPath({
        prevValues: prevFormikValues,
        nextValues: nextFormikValues,
        path: key,
      }) &&
      isEqualPrevAndNextObjByPath({
        prevValues: prevFormikErrors,
        nextValues: nextFormikErrors,
        path: key,
      }) &&
      isEqualPrevAndNextObjByPath({
        prevValues: prevFormikTouched,
        nextValues: nextFormikTouched,
        path: key,
      })
  );
};
