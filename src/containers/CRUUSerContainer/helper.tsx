import dayjs from 'dayjs';
import { MyProfile } from 'src/queries';
import { getRoleNamePayload } from 'src/queries/Profile/helpers';
import { DelegatedAccess, UserDetail, USER_STATUS } from 'src/queries/Users/types';
import { ErrorService, Yup } from 'src/services';
import { getTitleCase } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { DateFormatWithYear } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { USER_MODE } from './enums';

/*** Types & Interfaces ***/
export type DelegateAccessFormValue = {
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

export interface CRUUserFormValue {
  mode: USER_MODE;

  // General Info
  firstName: UserDetail['firstName'];
  lastName: UserDetail['lastName'];
  middleName: UserDetail['middleName'];
  defaultUserType: UserDetail['defaultUserType'];
  username: UserDetail['username'];
  email: UserDetail['email'];
  lastLoginDate: UserDetail['lastLoginDate'];
  passwordSetDate: UserDetail['passwordSetDate'];
  currentPassword?: string;
  newPassword?: string;
  status: boolean;

  // User Type
  delegateAccess: DelegateAccessFormValue;
  tempDelegateAccess: DelegateAccessFormValue;

  delegatedAccess: DelegatedAccess[];
  roles: string[];

  // Comments
  comments: UserDetail['comments'];
}

export type CRUUserFormikProps = CommonFormikProps<CRUUserFormValue>;

/*** Constants ***/
export const initialCRUUserFormValue: CRUUserFormValue = {
  mode: null,

  // General Info
  firstName: '',
  lastName: '',
  middleName: '',
  defaultUserType: '',
  username: '',
  email: '',
  lastLoginDate: '',
  passwordSetDate: '',
  newPassword: '',
  currentPassword: '',
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
  firstName: Yup.string().letterOnly().max(100).notTrimmable().required(),
  lastName: Yup.string().letterOnly().max(100).notTrimmable().required(),
  middleName: Yup.string().letterOnly().notTrimmable().max(5),
  defaultUserType: Yup.string().typeError('Please select at least 1 user type'),
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

/*** Functions ***/
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

export const getValueRoles = (roles: UserDetail['roles'] | MyProfile['roles']) => {
  return roles.map((role) => role.role.name);
};

export const getPayloadDelegateAccess = (delegateAccess: CRUUserFormValue['delegateAccess']) => {
  if (isEmpty(delegateAccess)) return [];
  return delegateAccess.map((item) => ({
    delegatedUserId: item.delegatedUserId,
    roleName: getRoleNamePayload(item.roleName),
    startDate: !isEmpty(item.startDate) ? dayjs(item.startDate).format(DateFormatWithYear) : null,
    endDate: !isEmpty(item.endDate) ? dayjs(item.endDate).format(DateFormatWithYear) : null,
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

  delete payload.mode;
  delete payload.lastLoginDate;
  delete payload.passwordSetDate;
  delete payload.tempDelegateAccess;
  delete payload.newPassword;
  delete payload.currentPassword;

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

  delete payload.mode;
  delete payload.tempDelegateAccess;
  delete payload.lastLoginDate;
  delete payload.passwordSetDate;
  delete payload.fullName;
  delete payload.newPassword;
  delete payload.currentPassword;

  return payload;
};

export const isEditUserMode = (mode: USER_MODE) => {
  return mode === USER_MODE.EDIT_USER;
};
export const isAddUserMode = (mode: USER_MODE) => {
  return mode === USER_MODE.ADD_USER;
};
export const isEditProfileMode = (mode: USER_MODE) => {
  return mode === USER_MODE.EDIT_PROFILE;
};
