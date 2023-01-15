import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import { UserDetail } from 'src/queries/Users/types';
import { Yup } from 'src/services';

export enum CRUUSER_KEY {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  MIDDLE_NAME = 'middleName',
  DEFAULT_USER_TYPE = 'defaultUserType',
  USERNAME = 'username',
  EMAIL = 'email',
  LAST_LOGIN_DATE = 'lastLoginDate',
  PASSWORD_SET_DATE = 'passwordSetDate', //pragma: allowlist secret
  ACCOUNT_DISABLED = 'accountDisabled',
  COMMENTS = 'comments',
}
export type CRUUserFormValue = {
  isViewMode: boolean;

  // General Info
  firstName: UserDetail['firstName'];
  lastName: UserDetail['lastName'];
  middleName: UserDetail['middleName'];
  defaultUserType: UserDetail['defaultUserType'];
  username: UserDetail['username'];
  email: UserDetail['email'];
  lastLoginDate: UserDetail['lastLoginDate'];
  passwordSetDate: UserDetail['passwordSetDate'];
  accountDisabled: UserDetail['accountDisabled'];

  // Comments
  comment: UserDetail['firstName'];
};

export const initialCRUUserFormValue = {
  isViewMode: null,

  // General Info
  firstName: '',
  lastName: '',
  middleName: '',
  defaultUserType: '',
  username: '',
  email: '',
  lastLoginDate: '',
  passwordSetDate: '',
  accountDisabled: false,

  // Comments
  comment: '',
};

export const cRUUserFormSchema = Yup.object().shape({
  // General Info
  firstName: Yup.string().letterOnly().max(255).required(),
  lastName: Yup.string().letterOnly().max(255).required(),
  middleName: Yup.string().letterOnly().max(5),
  defaultUserType: Yup.string().nullable(),
  username: Yup.string().username().required(),
  email: Yup.string().email().required(),
  lastLoginDate: Yup.string().notRequired(),
  passwordSetDate: Yup.string().notRequired(),
  accountDisabled: Yup.boolean().required(),
  // Comments
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
