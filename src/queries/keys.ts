import { UseQueryOptions } from 'react-query';

export enum API_QUERIES {
  CONTENT = '/content',
  ZIP_CODE = '/zip-code',
  PERMISSIONS = '/permissions',

  // Profile
  PROFILE = '/me',
  DELEGATION_ACCESSES = '/delegation-accesses',

  // Users Management
  USERS = '/users',
  USER = '/users/:id',
  SEARCH_USER = 'users/search',
  EXPORT_USERS = 'users/export',
  SEARCH_PROJECTS = 'projects/search',

  // Global Settings
  GLOBAL_SETTINGS = 'global-settings',
}

export type QueryOptions<T> = Omit<UseQueryOptions, 'QueryKey'> & { QueryKey: T };
