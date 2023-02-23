export enum CRUUSER_KEY {
  // general info
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  MIDDLE_NAME = 'middleName',
  DEFAULT_USER_TYPE = 'defaultUserType',
  USERNAME = 'username',
  EMAIL = 'email',
  LAST_LOGIN_DATE = 'lastLoginDate',
  PASSWORD_SET_DATE = 'passwordSetDate', //pragma: allowlist secret
  STATUS = 'status',
  CURRENT_PASSWORD = 'currentPassword', //pragma: allowlist secret
  NEW_PASSWORD = 'newPassword', //pragma: allowlist secret

  // User Type
  DELEGATE_ACCESS = 'delegateAccess',
  DELEGATED_ACCESS = 'delegatedAccess',
  ROLES = 'roles',
  FIS_SU_INFO = 'fisSuInfo',
  FIS_PI_INFO = 'fisPiInfo',
  FIS_FA_INFO = 'fisFaInfo',

  // Permissions
  PERMISSIONS = 'permissions',

  // Comments
  COMMENTS = 'comments',
}

export enum CRUUSER_USER_TYPE_KEY {
  //fields & payloads
  DIRECT_INQUIRIES_TO = 'directInquiriesTo',
  FA_STAFF_TO_REVIEW = 'faStaffToReview',
  SEND_INVOICE_TO = 'sendInvoiceTo',
  SEND_INVOICE_TO_EMAIL = 'sendInvoiceToEmail',
  PHONE_NUMBER = 'phoneNumber',
  DEPARTMENT = 'department',
  ADDRESS_STREET = 'addressStreet',
  ADDRESS_CITY = 'addressCity',
  ADDRESS_STATE = 'addressState',
  ADDRESS_ZIP = 'addressZip',
  ADDRESS_ZIP_4 = 'addressZip4',
  ADDRESS_COUNTRY = 'addressCountry',
  REMITTANCE_NAME = 'remittanceName',
  REMITTANCE_PHONE_NUMBER = 'remittancePhoneNumber',
  PI_CODE = 'piCode',
  FA_CODE = 'faCode',
  USER_FIS_PROJECTS = 'userFisProjects',
  USER_FIS_CODES = 'userFisCodes',

  //fields only
  USE_EXISTING_PI_CODE = 'useExistingPICode',
  CURRENT_PI_CODE = 'currentPICode',
  CURRENT_FA_CODE = 'currentFACode',
  CURRENT_SEARCH_PROJECT = 'currentSearchProject',
}

export enum USER_MODE {
  EDIT_USER = 'EDIT_USER',
  EDIT_PROFILE = 'EDIT_PROFILE',
  ADD_USER = 'ADD_USER',
}

export enum USER_TYPE_KEY {
  TAB = 'tab',
}
