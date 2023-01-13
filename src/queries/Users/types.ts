import { TableParams } from 'src/redux/types';

export enum USER_KEY {
  USERNAME = 'username',
  EMAIL = 'email',
  FULL_NAME = 'fullName',
  ID = 'id',
  LAST_LOGIN_DATE = 'lastLoginDate',
  DISPLAY_NAME = 'displayName',
  SYSTEM = 'system',
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
