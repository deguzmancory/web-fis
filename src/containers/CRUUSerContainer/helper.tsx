import dayjs from 'dayjs';
import { get } from 'lodash';
import { MyProfile } from 'src/queries';
import { FACode, PICode } from 'src/queries/Contents/types';
import { getRoleNamePayload } from 'src/queries/Profile/helpers';
import {
  CUPermission,
  DelegatedAccess,
  FADetail,
  PIDetail,
  SharedUserTypeDetails,
  SUDetail,
  UserDetail,
  USER_STATUS,
} from 'src/queries/Users/types';
import { ErrorService, Yup } from 'src/services';
import { getTitleCase } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { DateFormatWithYear } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { USER_MODE } from './enums';

/*** Types & Interfaces ***/

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
  delegatedAccess: DelegatedAccess[];
  roles: string[];
  fisSuInfo: SUDetailFormValue;
  fisPiInfo: PIDetailFormValue;
  fisFaInfo: FADetailFormValue;

  // Permissions -- CU
  permissions: CUPermission[];

  // Comments
  comments: UserDetail['comments'];
}

export interface PIDetailFormValue extends PIDetail {
  useExistingPICode: boolean;
}

export interface SUDetailFormValue extends SUDetail {
  currentPICode: PICode;
}

export interface FADetailFormValue extends FADetail {
  currentFACode: string;
}

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
  id?: string;
}[];

export type CRUUserFormikProps = CommonFormikProps<CRUUserFormValue>;

/*** Constants ***/
const initialSharedUserTypeFormValue: SharedUserTypeDetails = {
  sendInvoiceTo: '',
  sendInvoiceToEmail: '',
  department: '',
  addressStreet: '',
  addressCity: '',
  addressState: '',
  addressZip: '',
  addressZip4: '',
  addressCountry: '',
  remittanceName: '',
  remittancePhoneNumber: '',
};

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
  delegatedAccess: [],
  roles: [],

  fisFaInfo: {
    ...initialSharedUserTypeFormValue,
    faCode: null,
    userFisCodes: [],
    userFisProjects: [],

    currentFACode: null,
  },
  fisPiInfo: {
    ...initialSharedUserTypeFormValue,
    piCode: null,
    directInquiriesTo: '',
    phoneNumber: '',
    faStaffToReview: '',
    userFisProjects: [],

    useExistingPICode: false,
  },
  fisSuInfo: {
    ...initialSharedUserTypeFormValue,
    directInquiriesTo: '',
    phoneNumber: '',
    faStaffToReview: '',
    userFisCodes: [],
    userFisProjects: [],

    currentPICode: null,
  },

  // Permissions -- CU
  permissions: [],

  // Comments
  comments: '',
};

export const sharedUserDetailFormSchema = {
  sendInvoiceTo: Yup.string().nullable().optional(),
  sendInvoiceToEmail: Yup.string().notTrimmable().email().nullable().optional(),
  department: Yup.string().nullable().optional(),
  addressStreet: Yup.string().nullable().optional(),
  addressCity: Yup.string().nullable().optional(),
  addressState: Yup.string().nullable().optional(),
  addressZip: Yup.string().nullable().optional(),
  addressZip4: Yup.string().nullable().optional(),
  addressCountry: Yup.string().nullable().optional(),
  remittanceName: Yup.string().nullable().optional(),
  remittancePhoneNumber: Yup.string().nullable().optional(),
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

  fisFaInfo: Yup.object()
    .nullable()
    .shape({
      ...sharedUserDetailFormSchema,
      faCode: Yup.string().nullable().optional(),
    }),
  fisPiInfo: Yup.object()
    .nullable()
    .shape({
      ...sharedUserDetailFormSchema,
      piCode: Yup.string().nullable().optional(),
      directInquiriesTo: Yup.string().nullable().optional(),
      phoneNumber: Yup.string().nullable().optional(),
      faStaffToReview: Yup.string().nullable().optional(),
    }),
  fisSuInfo: Yup.object()
    .nullable()
    .shape({
      ...sharedUserDetailFormSchema,
      directInquiriesTo: Yup.string().nullable().optional(),
      phoneNumber: Yup.string().nullable().optional(),
      faStaffToReview: Yup.string().nullable().optional(),
    }),

  // Comments
  comment: Yup.string().nullable(),
});

/*** Functions ***/
export const getErrorMessage = (fieldName: string, { touched, errors }) => {
  if (!fieldName || !touched || !errors) return '';

  const error = get(errors, fieldName);

  return get(touched, fieldName) && error ? error : '';

  // eslint-disable-next-line security/detect-object-injection
  // return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
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
    id: item.id || undefined,
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
    fisFaInfo: values.fisFaInfo,
    fisPiInfo: values.fisPiInfo,
    fisSuInfo: values.fisSuInfo,

    permissions: !isEmpty(values.permissions)
      ? values.permissions.map((permission) => permission.permissionId)
      : [],
  };

  delete payload.mode;
  delete payload.lastLoginDate;
  delete payload.passwordSetDate;
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
    fisFaInfo: values.fisFaInfo,
    fisPiInfo: values.fisPiInfo,
    fisSuInfo: values.fisSuInfo,

    permissions: !isEmpty(values.permissions)
      ? values.permissions.map((permission) => permission.permissionId)
      : [],
  };

  delete payload.mode;
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

export const getUncontrolledInputFieldProps =
  ({ values, setFieldTouched, setFieldValue }) =>
  (name: string, options: { onBlur: (name, values) => void }) => {
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

export const getPICodeOptions = ({
  piCodes,
  fullObjectValue = false,
}: {
  piCodes: PICode[];
  fullObjectValue: boolean;
}) => {
  if (isEmpty(piCodes)) return [];

  return piCodes.map((piCode) => {
    return {
      label: `${piCode.code}, ${piCode.piName}`,
      value: fullObjectValue ? piCode : piCode.code,
    };
  });
};

export const getFACodeOptions = (faCodes: FACode[]) => {
  if (isEmpty(faCodes)) return [];

  return faCodes.map((faCode) => {
    return {
      label: `${faCode.code}`,
      value: faCode.code,
    };
  });
};
