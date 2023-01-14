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
}

export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'ACTIVE',
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
  roleId: string;
  startDate: string;
  endDate: string;
  isAllProjects: boolean;
  projectNumber: string;
};

export type AddUserPayload = {
  username: User['username'];
  firstName: string;
  lastName: string;
  middleName: string;
  email: User['email'];
  comments: string;
  defaultUserType: ROLE_NAME;
  roles: ROLE_NAME[];
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
  lastLoginDate: User;
  isDhUser: boolean;
  allowMaintenanceModeLogin: boolean;
  accountDisabled: boolean;
  passwordSetDate: string;
  comments: string;
  defaultUserType: ROLE_NAME;
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
