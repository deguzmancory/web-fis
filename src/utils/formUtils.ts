import { FormikErrors } from 'formik';
import { get } from 'lodash';
import { Callback } from 'src/redux/types';
import { CommonFormikProps } from './commonTypes';
import { convertCurrencyInputToString, MoneyInputDetect } from './formatUtils';
import { isEqualPrevAndNextObjByPath } from './handlerUtils';

export const getUncontrolledInputFieldProps =
  ({ values, setFieldTouched, setFieldValue }) =>
  (name: string, options?: { onBlur: (name, value) => void }) => {
    return {
      name,
      defaultValue: get(values, name) || '',
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
      defaultValue: get(values, name) || '',
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

  return !formKeysNeedRender.some(
    (key) =>
      !isEqualPrevAndNextObjByPath({
        prevValues: prevFormikValues,
        nextValues: nextFormikValues,
        path: key,
      }) ||
      !isEqualPrevAndNextObjByPath({
        prevValues: prevFormikErrors,
        nextValues: nextFormikErrors,
        path: key,
      }) ||
      !isEqualPrevAndNextObjByPath({
        prevValues: prevFormikTouched,
        nextValues: nextFormikTouched,
        path: key,
      })
  );
};

export const checkRowStateAndSetValue = <TRecord = any, TValue = any>({
  value,
  name,
  index,
  records,
  setFieldValue,
  onRemoveRow,
  onAddRow,
  callback,
}: {
  name: string;
  value: TValue;
  index: number;
  records: TRecord[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<any>>;
  onRemoveRow: (index: number) => void;
  onAddRow: Callback;
  callback?: Callback;
}) => {
  const currentRow = get(records, index);

  // if !value and other cell of current row do not have value => remove row
  if (
    !value &&
    !Object.entries(currentRow).some(([key, value]) => {
      // exclude the current field cause "currentRow" references to the previous data now
      if (name.includes(key)) return false;
      return !!value;
    })
  ) {
    // not remove the last field
    if (index === records.length - 1) return;

    onRemoveRow(index);
  }
  // add new row if the current row is the last row
  else {
    const rowAbove = get(records, `${index + 1}`);
    if (!rowAbove) {
      onAddRow();
    }

    setFieldValue(name, value);

    if (callback) {
      callback();
    }
  }
};
