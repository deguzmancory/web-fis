import { UseQueryOptions } from 'react-query';

export enum API_QUERIES {
  PROFILE = '/me',
  CONTENT = '/content',
  ZIP_CODE = '/zip-code',
  USER_ID = '/user-id',
  PERMISSIONS = '/permissions',

  // Users Management
  USERS = '/users',
  USER = '/users/:id',
}

export type QueryOptions<T> = Omit<UseQueryOptions, 'QueryKey'> & { QueryKey: T };
