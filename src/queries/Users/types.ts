import { TableParams } from 'src/redux/types';
import { ROLE_NAME } from '../Profile/helpers';
export enum USER_KEY {
  USERNAME = 'username',
  EMAIL = 'email',
  FULL_NAME = 'fullName',
  ID = 'id',
  LAST_LOGIN_DATE = 'lastLoginDate',
  DISPLAY_NAME = 'displayName',
  SYSTEM = 'system',
  PROJECT_NUMBER = 'projectNumber',
  START_DATE = 'startDate',
  START_DATE_TEMP = 'startDateTemp',
  END_DATE = 'endDate',
  END_DATE_TEMP = 'endDateTemp',
  DEFAULT_USER_TYPE = 'defaultUserType',
}

export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  DENIED = 'DENIED',
}

export interface User {
  username: string;
  email: string;
  fullName: string;
  id: string;
  lastLoginDate: string;
  displayName: string;
  system: string;
}

export type GetPropertiesParams = TableParams & {
  [key: string]: string | number | string[];
};

export interface GetSearchFinancialProjectsParams {
  search: string;
  roleType: ROLE_NAME;
  excludeCode: string;
  excludeProject: string;
}

export type DelegateAccess = {
  id: string;
  delegatedUserId: User['id'];
  roleName: string;
  startDate: string;
  endDate: string;
  isAllProjects: boolean;
  projectNumber: string;
  userId?: string;
  roleId?: string;
  delegatedUser?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
    username: string;
    email: string;
    lastLoginDate: string;
    isDhUser: boolean;
    allowMaintenanceModeLogin: boolean;
    passwordSetDate: string;
    comments: string;
    defaultUserType: string;
    status: string;
  };
  userRole?: {
    createdAt: string;
    role: {
      displayName: string;
    };
    roleId: string;
    updatedAt: string;
    userId: string;
  };
};

export type AddUserPayload = {
  username: UserDetail['username'];
  firstName: UserDetail['firstName'];
  lastName: UserDetail['lastName'];
  middleName: UserDetail['middleName'];
  email: UserDetail['email'];
  comments: UserDetail['comments'];
  defaultUserType: UserDetail['defaultUserType'];
  roles: string[];
  delegateAccess: DelegateAccess[];
  fisFaInfo: FADetail;
  fisPiInfo: PIDetail;
  fisSuInfo: SUDetail;
};

export type UpdateUserPayload = {
  id: UserDetail['id'];
  username: UserDetail['username'];
  firstName: UserDetail['firstName'];
  lastName: UserDetail['lastName'];
  middleName: UserDetail['middleName'];
  fullName: UserDetail['fullName'];
  email: UserDetail['email'];
  comments: UserDetail['comments'];
  defaultUserType: UserDetail['defaultUserType'];
  roles: string[];
  allowMaintenanceModeLogin: UserDetail['allowMaintenanceModeLogin'];
  isDhUser: UserDetail['isDhUser'];
  status: UserDetail['status'];
  delegateAccess: DelegateAccess[];
  fisFaInfo: FADetail;
  fisPiInfo: PIDetail;
  fisSuInfo: SUDetail;
};

export type UserRole = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  displayName: string;
  description: string;
  canBeUpdated: boolean;
  canBeDeleted: boolean;
  domain: string;
};

export type UserDetail = {
  id: User['id'];
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: User['fullName'];
  username: User['username'];
  email: User['email'];
  isDhUser: boolean;
  allowMaintenanceModeLogin: boolean;
  accountDisabled: boolean;
  lastLoginDate: User['lastLoginDate'];
  passwordSetDate: string;
  comments: string;
  defaultUserType: string;
  status: USER_STATUS;
  roles: {
    userId: User['id'];
    roleId: UserRole['id'];
    createdAt: string;
    updatedAt: string;
    role: UserRole;
  }[];
  delegateAccesses: DelegateAccess[];
  delegatedAccesses: DelegatedAccess[];
  fisFaInfo: FADetail;
  fisPiInfo: PIDetail;
  fisSuInfo: SUDetail;

  permissions: CUPermission[];

  // Audit info
  userAuditTrails: AuditInformation[];
};

export type AuditInformation = {
  action: string;
  createdAt: string;
  fullName: UserDetail['fullName'];
  id: UserDetail['id'];
  timestamp: string;
  updatedAt: string;
  user: {
    allowMaintenanceModeLogin: UserDetail['allowMaintenanceModeLogin'];
    comments: UserDetail['comments'];
    createdAt: UserDetail['createdAt'];
    defaultUserType: UserDetail['defaultUserType'];
    email: UserDetail['email'];
    firstName: UserDetail['firstName'];
    fullName: UserDetail['fullName'];
    id: UserDetail['id'];
    isDhUser: UserDetail['isDhUser'];
    lastLoginDate: UserDetail['lastLoginDate'];
    lastName: UserDetail['lastName'];
    middleName: UserDetail['middleName'];
    passwordSetDate: UserDetail['passwordSetDate'];
    status: UserDetail['status'];
    updatedAt: UserDetail['updatedAt'];
    username: UserDetail['username'];
  };
  userId: UserDetail['id'];
  username: UserDetail['username'];
};

export interface SearchUser {
  username: UserDetail['username'];
  email: UserDetail['email'];
  fullName: UserDetail['fullName'];
  id: UserDetail['id'];
  roles: UserRole[];
  defaultUserType: UserDetail['defaultUserType'];
}

export type SearchProject = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fisFaInfoId: any; //TODO: tin_pham update type
  fisPiInfoId: any; //TODO: tin_pham update type
  fisSuInfoId: any; //TODO: tin_pham update type
  projectNumber: string;
};

export interface SearchFinancialProject {
  id: string;
  name: string;
  number: string;
  ac: string;
  faCode: string;
  piCode: string;
  inActive: boolean;
  startDate: string;
  endDate: string;
}

export type UrlExportUser = {
  head: string;
  get: string;
};

export type DelegatedAccess = {
  user: DelegateAccess['delegatedUser'];
  delegatedUserId: DelegateAccess['delegatedUserId'];
  endDate: DelegateAccess['endDate'];
  id: string;
  isAllProjects: boolean;
  projectNumber: DelegateAccess['projectNumber'];
  roleId: DelegateAccess['roleId'];
  startDate: DelegateAccess['startDate'];
  userId: DelegateAccess['userId'];
  userRole: {
    userId: User['id'];
    roleId: UserRole['id'];
    createdAt: string;
    updatedAt: string;
    role: {
      displayName: UserRole['displayName'];
    };
  };
};

export interface UserFisCode {
  id: string;
  code: string;
  codeType: string;

  piName?: string;
}

export interface UserFisProject {
  id: string;
  projectNumber: string;
}
export interface SharedUserTypeDetails {
  sendInvoiceTo: string;
  sendInvoiceToEmail: string;
  department: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressZip4: string;
  addressCountry: string;
  remittanceName: string;
  remittancePhoneNumber: string;
}

export interface FADetail extends SharedUserTypeDetails {
  faCode: string;
  userFisCodes: UserFisCode[];
  userFisProjects: UserFisProject[];
}

export interface PIDetail extends SharedUserTypeDetails {
  piCode: string;
  directInquiriesTo: string;
  phoneNumber: string;
  faStaffToReview: string;
  userFisProjects: UserFisProject[];
}

export interface SUDetail extends SharedUserTypeDetails {
  directInquiriesTo: string;
  phoneNumber: string;
  faStaffToReview: string;
  userFisCodes: UserFisCode[];
  userFisProjects: UserFisProject[];
}

export type UpdateUserLastPasswordChangedParams = {
  username: User['username'];
};

export type CUPermission = {
  createdAt?: string;
  permissionId: number;
  updatedAt?: string;
  userId?: string;
};
