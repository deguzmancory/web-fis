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

  // Comments
  COMMENTS = 'comments',
}

export enum USER_MODE {
  EDIT_USER,
  EDIT_PROFILE,
  ADD_USER,
}
