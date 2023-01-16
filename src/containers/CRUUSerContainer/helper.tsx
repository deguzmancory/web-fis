import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import { UserDetail, USER_STATUS } from 'src/queries/Users/types';
import { ErrorService, Yup } from 'src/services';
import { getTitleCase } from 'src/utils';

export enum CRUUSER_KEY {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  MIDDLE_NAME = 'middleName',
  DEFAULT_USER_TYPE = 'defaultUserType',
  USERNAME = 'username',
  EMAIL = 'email',
  LAST_LOGIN_DATE = 'lastLoginDate',
  PASSWORD_SET_DATE = 'passwordSetDate', //pragma: allowlist secret
  STATUS = 'status',
  ROLES = 'roles',
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
  status: boolean;

  // User Type
  roles: string[];

  // Comments
  comments: UserDetail['comments'];
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
  status: false,

  // User Type
  roles: [],

  // Comments
  comments: '',
};

export const cRUUserFormSchema = Yup.object().shape({
  // General Info
  firstName: Yup.string().letterOnly().max(255).required(),
  lastName: Yup.string().letterOnly().max(255).required(),
  middleName: Yup.string().letterOnly().max(5),
  defaultUserType: Yup.string().required().typeError('Please select at least 1 user type'),
  username: Yup.string().username().required(),
  email: Yup.string().email().required(),
  lastLoginDate: Yup.string().notRequired(),
  passwordSetDate: Yup.string().notRequired(),

  // UserType
  roles: Yup.array()
    .of(Yup.string().required().typeError(ErrorService.MESSAGES.required))
    .min(1, 'Please select at least 1 user type'),

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

export const getValueUserStatus = (status: UserDetail['status']) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return true;
    case USER_STATUS.INACTIVE:
      return false;
    default:
      return false;
  }
};

export const getPayloadUserStatus = (status: boolean) => {
  switch (status) {
    case true:
      return USER_STATUS.INACTIVE;
    case false:
      return USER_STATUS.ACTIVE;
    default:
      return USER_STATUS.ACTIVE;
  }
};

export const getValueRoles = (roles: UserDetail['roles']) => {
  return roles.map((role) => role.role.name);
};

export const formatPayloadSubmit = (values: CRUUserFormValue) => {
  const _values = {
    ...values,
    firstName: getTitleCase(values.firstName),
    lastName: getTitleCase(values.lastName),
    middleName: values.middleName.toUpperCase(),
    username: values.username.toLowerCase(),
    status: getPayloadUserStatus(values.status),
    delegateAccess: [
      // {
      //   delegatedUserId: '028c60dc-c831-4d15-8cac-a9d51ea58850',
      //   roleName: 'PI',
      //   startDate: '2022-11-17 00:00:00.000',
      //   endDate: '2022-12-17 00:00:00.000',
      //   isAllProjects: false,
      //   projectNumber: '222',
      // },
    ],
  };
  delete _values.isViewMode;
  delete _values.lastLoginDate;
  delete _values.passwordSetDate;

  return _values;
};
