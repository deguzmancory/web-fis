import { TableParams } from 'src/redux/types';

export enum USER_KEY {
  USERNAME = 'username',
  DEFAULT_SUB_SYSTEM_CODE = 'defaultSubsystemCode',
  EMAIL = 'email',
  FULL_NAME = 'fullName',
  ID = 'id',
  LAST_LOGIN_DATE = 'lastLoginDate',
  ROLE_DISPLAY_NAME = 'roleDisplayName',
}

export interface User {
  defaultSubsystemCode: string;
  username: string;
  email: string;
  fullName: string;
  id: string;
  lastLoginDate: string;
  roleDisplayName: string;
}

export type GetPropertiesParams = TableParams & {
  [key: string]: string | number | string[];
};
