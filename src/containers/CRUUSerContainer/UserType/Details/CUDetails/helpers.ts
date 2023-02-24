export enum PERMISSION_CU_LABEL {
  APPROVAL_OF_POS_AND_PAYMENTS_OVER_24999 = 'Approval of POs and Payments over $24,999',
  PRINT_CHECKS = 'Print Checks',
  VIEW_CHECK_REGISTERS = 'View Check Registers',
  EDIT_STAFF_LISTING = 'Edit Staff Listing',
  RCUH_PAYROLL_REPORT = 'RCUH Payroll Report',
  FINANCIAL_FORECAST_PAYROLL_REPORT = 'Financial Forecast Payroll Report',
  VACATION_AND_SICK_LEAVE_AUDIT_PAGE = 'Vacation and Sick Leave Audit Page',
  VIEW_VENDOR_LIST = 'View Vendor List',
  VIEW_VENDOR_MASTER_RECORDS = 'View Vendor Master Records',
  EDIT_VENDOR_MASTER_RECORDS = 'Edit Vendor Master Records',
  USER_MANAGEMENT = 'User Management',
}

export enum PERMISSION_CU_OPTION_VALUE {
  ALL = 'ALL',
  NON_CENTRAL_USERS = 'NON_CENTRAL_USERS',
  VIEW_ONLY = 'VIEW_ONLY',
}

export const optionsPermissionCuUserManagement = [
  { label: 'All', value: PERMISSION_CU_OPTION_VALUE.ALL },
  { label: 'Non Central Users', value: PERMISSION_CU_OPTION_VALUE.NON_CENTRAL_USERS },
  { label: 'View Only', value: PERMISSION_CU_OPTION_VALUE.VIEW_ONLY },
];
