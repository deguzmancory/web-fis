import { PERMISSION_VALUE } from 'src/queries/Permissions';

let _permissions: string[] = [];

const setPermissions = async (permissions: string[]) => {
  _permissions = permissions || [];
};

const clearPermission = () => {
  _permissions = [];
};

const getPermissions = () => {
  return _permissions;
};

const registerCheck = () => ({
  canView: _permissions?.includes(PERMISSION_VALUE.VIEW_CHECK_REGISTERS),
});

const printCheck = () => ({
  canView: _permissions?.includes(PERMISSION_VALUE.PRINT_CHECKS),
});

const paymentOver = () => ({
  canUpdate: _permissions?.includes(PERMISSION_VALUE.APPROVAL_PO_PAYMENTS_OVER_24999),
});

const financialForecastPayrollReport = () => ({
  canView: _permissions?.includes(PERMISSION_VALUE.FINANCIAL_FORECAST_PAYROLL_REPORT),
});

const payrollReport = () => ({
  canView: _permissions?.includes(PERMISSION_VALUE.RCUH_PAYROLL_REPORT),
});

const vacationReport = () => ({
  canView: _permissions?.includes(PERMISSION_VALUE.VACATION_SICK_LEAVE_AUDIT_PAGE),
});

const staff = () => ({
  canUpdate: _permissions?.includes(PERMISSION_VALUE.EDIT_STAFF_LISTING),
});

const user = () => ({
  canCreate: _permissions?.includes(PERMISSION_VALUE.ALLOW_CREATE_USER),
  canView: _permissions?.includes(PERMISSION_VALUE.ALLOW_READ_USER),
  canUpdate: _permissions?.includes(PERMISSION_VALUE.ALLOW_UPDATE_USER),
  canDelete: _permissions?.includes(PERMISSION_VALUE.ALLOW_DELETE_USER),
});

const userCU = () => ({
  canUpdate: _permissions?.includes(PERMISSION_VALUE.ALLOW_UPDATE_CU_USER),
});

const vendor = () => ({
  canView: _permissions?.includes(PERMISSION_VALUE.VIEW_VENDOR_LIST),
});

const vendorMaster = () => ({
  canView: _permissions?.includes(PERMISSION_VALUE.VIEW_VENDOR_MASTER_RECORDS),
  canUpdate: _permissions?.includes(PERMISSION_VALUE.EDIT_VENDOR_MASTER_RECORDS),
});

export default {
  setPermissions,
  clearPermission,
  getPermissions,

  registerCheck,
  printCheck,
  paymentOver,
  financialForecastPayrollReport,
  payrollReport,
  vacationReport,
  staff,
  user,
  userCU,
  vendor,
  vendorMaster,
};
