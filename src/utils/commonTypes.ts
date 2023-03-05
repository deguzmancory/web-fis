import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';

export type CommonFormikProps<T> = {
  values: T;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<T>>;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
  setFieldTouched: (
    field: string,
    touched?: boolean,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<T>>;
  getUncontrolledFieldProps?: (name: string, options?: { onBlur: (name, values) => void }) => any;
  getUncontrolledCurrencyInputFieldProps?: (
    name: string,
    options?: { onBlur: (name, values) => void }
  ) => any;
};

export type CommonPlacement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'bottom-end'
  | 'bottom-start'
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start'
  | 'top-end'
  | 'top-start';
