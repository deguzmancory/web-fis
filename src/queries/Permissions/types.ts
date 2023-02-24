export enum PERMISSION_VALUE {
  VIEW_CHECK_REGISTERS = 'CHECK:R',

  PRINT_CHECKS = 'CHECK_PRINT:R',

  APPROVAL_PO_PAYMENTS_OVER_24999 = 'PAYMENT_OVER:U',

  FINANCIAL_FORECAST_PAYROLL_REPORT = 'REPORT_FFP:R',

  RCUH_PAYROLL_REPORT = 'REPORT_PAYROLL:R',

  VACATION_SICK_LEAVE_AUDIT_PAGE = 'REPORT_VACATION:R',

  EDIT_STAFF_LISTING = 'STAFF:U',

  ALLOW_CREATE_USER = 'USER:C',
  ALLOW_DELETE_USER = 'USER:D',
  ALLOW_READ_USER = 'USER:R',
  ALLOW_UPDATE_USER = 'USER:U',

  ALLOW_UPDATE_CU_USER = 'USER_CU:U',

  VIEW_VENDOR_LIST = 'VENDOR:R',

  VIEW_VENDOR_MASTER_RECORDS = 'VENDOR_MASTER:R',
  EDIT_VENDOR_MASTER_RECORDS = 'VENDOR_MASTER:U',
}

export type UserPermission = {
  id: number;
  createdAt: string;
  updatedAt: string;
  resourceName: string;
  displayName: string;
  description: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  isCuPermission: boolean;
  permissionGroupId: number;
};

export interface PermissionCuResponse {
  totalRecords: number;
  data: UserPermission[];
  payloadSize: number;
  hasNext: boolean;
}
