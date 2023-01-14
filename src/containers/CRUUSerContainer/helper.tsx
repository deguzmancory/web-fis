import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import { Yup } from 'src/services';

export enum CRUUSER_KEY {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  MIDDLE_NAME = 'middleName',
  DEFAULT_USER_TYPE = 'defaultUserType',
  USERNAME = 'username',
  EMAIL = 'email',
  COMMENTS = 'comment',
}
export type CRUUserFormValue = {
  firstName: string;
  lastName: string;
  middleName: string;
  defaultUserType: string;
  username: string;
  email: string;
  comment: string;
};

export const initialCRUUserFormValue = {
  firstName: '',
  lastName: '',
  middleName: '',
  defaultUserType: '',
  username: '',
  email: '',
  comment: '',
};

export const cRUUserFormSchema = Yup.object().shape({
  firstName: Yup.string().letterOnly().max(255).required(),
  lastName: Yup.string().letterOnly().max(255).required(),
  middleName: Yup.string().letterOnly().max(5),
  defaultUserType: Yup.string().nullable(),
  username: Yup.string().username().required(),
  email: Yup.string().email().required(),
  comment: Yup.string().nullable(),
});

export type CRUUserFormikProps = {
  values: CRUUserFormValue;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<CRUUserFormValue>>;
  errors: FormikErrors<CRUUserFormValue>;
  touched: FormikTouched<CRUUserFormValue>;
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
  setFieldTouched: (
    field: string,
    touched?: boolean,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<CRUUserFormValue>>;
};

export const getErrorMessage = (fieldName: CRUUSER_KEY, { touched, errors }) => {
  // eslint-disable-next-line security/detect-object-injection
  return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
};
