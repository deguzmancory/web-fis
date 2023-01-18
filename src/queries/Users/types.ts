import { TableParams } from 'src/redux/types';
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
  END_DATE = 'endDate',
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

export type DelegateAccess = {
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
  fisFaInfo: any; //TODO: tin_pham update type
  fisPiInfo: any; //TODO: tin_pham update type
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
  referenceId: number;
  referenceTable: string;
  projectNumber: string;
};
