import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import { getRoleNamePayload } from 'src/queries/Profile/helpers';
import { DelegatedAccess, UserDetail, USER_STATUS } from 'src/queries/Users/types';
import { ErrorService, Yup } from 'src/services';
import { getTitleCase } from 'src/utils';
import { formatDateUtc } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';

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

  // User Type
  DELEGATE_ACCESS = 'delegateAccess',
  TEMP_DELEGATE_ACCESS = 'tempDelegateAccess',
  DELEGATED_ACCESS = 'delegatedAccess',
  ROLES = 'roles',

  // Comments
  COMMENTS = 'comments',
}

type DelegateAccessFormValue = {
  isEdit: boolean;
  delegatedUserId: string;
  username: string;
  fullName: string;
  roleName: string;
  projectNumber: string;
  startDate: string;
  startDateTemp: string;
  endDate: string;
  endDateTemp: string;
  isAllProjects: boolean;
}[];

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
  delegateAccess: DelegateAccessFormValue;
  tempDelegateAccess: DelegateAccessFormValue;

  delegatedAccess: DelegatedAccess[];
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
  delegateAccess: [],
  tempDelegateAccess: [],
  delegatedAccess: [],
  roles: [],

  // Comments
  comments: '',
};

export const cRUUserFormSchema = Yup.object().shape({
  // General Info
  firstName: Yup.string().letterOnly().max(255).notTrimmable().required(),
  lastName: Yup.string().letterOnly().max(255).notTrimmable().required(),
  middleName: Yup.string().letterOnly().notTrimmable().max(5),
  defaultUserType: Yup.string().required().typeError('Please select at least 1 user type'),
  username: Yup.string().username().required(),
  email: Yup.string().notTrimmable().email().required(),
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

export const getErrorMessage = (fieldName: string, { touched, errors }) => {
  // eslint-disable-next-line security/detect-object-injection
  return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
};

export const getValueUserStatus = (status: UserDetail['status']) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return false;
    case USER_STATUS.INACTIVE:
      return true;
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
  return roles.map((role) => role.role.domain);
};

const getPayloadDelegateAccess = (delegateAccess: CRUUserFormValue['delegateAccess']) => {
  if (isEmpty(delegateAccess)) return [];
  return delegateAccess.map((item) => ({
    delegatedUserId: item.delegatedUserId,
    roleName: getRoleNamePayload(item.roleName),
    startDate: formatDateUtc(item.startDate),
    endDate: formatDateUtc(item.endDate),
    isAllProjects: false,
    projectNumber: item.projectNumber,
  }));
};

export const formatPayloadSubmit = (values: CRUUserFormValue) => {
  const payload = {
    ...values,
    firstName: getTitleCase(values.firstName),
    lastName: getTitleCase(values.lastName),
    middleName: getTitleCase(values.middleName),
    username: values.username.toLowerCase(),
    status: getPayloadUserStatus(values.status),
    delegateAccess: getPayloadDelegateAccess(values.delegateAccess),
  };

  delete payload.isViewMode;
  delete payload.lastLoginDate;
  delete payload.passwordSetDate;
  delete payload.tempDelegateAccess;

  return payload;
};

export const formatPayloadUpdate = (values: CRUUserFormValue, user: UserDetail) => {
  const payload = {
    ...values,
    id: user.id,
    username: values.username.toLowerCase(),
    firstName: getTitleCase(values.firstName),
    lastName: getTitleCase(values.lastName),
    middleName: getTitleCase(values.middleName),
    fullName: user.fullName,
    allowMaintenanceModeLogin: user.allowMaintenanceModeLogin,
    isDhUser: values.email.includes('datahouse.com') ? true : false,
    status: getPayloadUserStatus(values.status),
    delegateAccess: getPayloadDelegateAccess(values.delegateAccess),
  };

  delete payload.isViewMode;
  delete payload.tempDelegateAccess;
  delete payload.lastLoginDate;
  delete payload.passwordSetDate;
  delete payload.fullName;

  return payload;
};
