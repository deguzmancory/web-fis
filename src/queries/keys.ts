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
  SEARCH_USER = 'users/search',
  EXPORT_USERS = 'users/export',
  SEARCH_PROJECTS = 'projects/search',
}

export type QueryOptions<T> = Omit<UseQueryOptions, 'QueryKey'> & { QueryKey: T };
