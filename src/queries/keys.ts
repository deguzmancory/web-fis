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

  // Purchase Orders
  GET_PURCHASE_ORDERS = '/financial-svc/v1/purchase-orders',
  PO_DETAIL = '/purchase-orders/:id',
  PO_PAYMENT_DETAIL = '/po-payments/:id',
  PO_PAYMENT_REMAINING_BALANCE = 'po-payment/:id/remaining-balance',

  // Non PO Listing
  NON_PO_LISTING = '/direct-payments',

  // Non PO Payment
  // Authorization
  AUTHORIZATION_DETAIL = '/authorization-payments/:id',
  // Non Employee Travel
  NON_EMPLOYEE_TRAVEL_DETAIL = '/non-employee-travel-payments/:id',
  // Petty Cash
  PETTY_CASH_DETAIL = '/petty-cash-payments/:id',
  // Personal Automobile
  PERSONAL_AUTOMOBILE_DETAIL = '/personal-auto-payments/:id',

  // Vendor
  SEARCH_VENDOR = '/vendor/search',
  VENDORS = '/vendors',

  // Super Quotes
  SEARCH_QUOTE = '/super-quotes/numbers',

  // Projects
  GET_FINANCIAL_PROJECTS = '/financial-svc/v1/projects',
  SEARCH_PROFILE_PROJECTS = '/financial-svc/v1/projects/me',

  // Global Settings
  GLOBAL_SETTINGS = 'global-settings',
}

export type QueryOptions<T> = Omit<UseQueryOptions, 'QueryKey'> & { QueryKey: T };
