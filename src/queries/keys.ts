import { UseQueryOptions } from 'react-query';

export enum API_QUERIES {
  CONTENT = '/content',
  ZIP_CODE = '/zip-code',

  // Permissions
  MY_PERMISSIONS = '/permissions/me',
  PERMISSION_CU = '/permissions/cu',
  PI_CODES = '/pi-codes',
  FA_CODES = '/fa-codes',

  // Profile
  PROFILE = '/me',
  DELEGATION_ACCESSES = '/delegation-accesses',

  // Users Management
  USERS = '/users',
  USER = '/users/:id',
  SEARCH_USER = 'users/search',
  EXPORT_USERS = 'users/export',
  SEARCH_PROJECTS = 'projects/search',

  // Financial
  GET_FINANCIAL_PROJECTS = '/financial-svc/v1/projects',
  SEARCH_FINANCIAL_PROJECTS = '/financial-svc/v1/projects/search',

  // Global Settings
  GLOBAL_SETTINGS = 'global-settings',
}

export type QueryOptions<T> = Omit<UseQueryOptions, 'QueryKey'> & { QueryKey: T };
