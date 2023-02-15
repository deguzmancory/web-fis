const configs = {
  WEB_URL: process.env.REACT_APP_WEB_URL,
  API_URL: process.env.REACT_APP_API_URL,
  ADMIN_WEB_URL: process.env.REACT_APP_ADMIN_WEB_URL,
  IDENTITY_WEB_URL: process.env.REACT_APP_IDENTITY_WEB_URL,
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_COOKIE_DOMAIN: process.env.REACT_APP_COOKIE_DOMAIN,
  TIME_ZONE: process.env.REACT_APP_TIME_ZONE,
  APP_ENV: process.env.REACT_APP_BUILD_MODE,
  REACT_APP_AWS_S3_ACCOUNT_SERVICE_ASSETS_URL:
    process.env.REACT_APP_REACT_APP_AWS_S3_ACCOUNT_SERVICE_ASSETS_URL,
  APP_VERSION: process.env.REACT_APP_VERSION || '0.1.0',
  API_KEY: process.env.REACT_APP_API_KEY,
  S3_ACCOUNT_SERVICE_ASSETS_URL: process.env.REACT_APP_AWS_S3_ACCOUNT_SERVICE_ASSETS_URL,
  S3_WEB_STORAGE_ASSETS_URL: process.env.REACT_APP_AWS_S3_WEB_STORAGE_ASSETS_URL,
};

const common = {
  CONNECTION_TIMEOUT: 30000,
  MAXIMUM_FILE_SIZE: 1024 * 1024 * 7, //7 MB
  WAITING_TIME: 5000, // 5 secs
  ANIMATION_TIME: 300,
  MAXIMUM_AVATAR_SIZE: 16 * 1024 * 1024, // 16MB
};

const table = {
  ROWS_PER_PAGE_OPTIONS: [20, 50, 100],
  ROWS_PER_PAGE: 20,
};

const textLength = {
  CODE_LENGTH: 16,
  TEXT_SHORT_LENGTH: 50,
  TEXT_MEDIUM_LENGTH: 100,
  TEXT_MAX_LENGTH: 255,
  VERIFICATION_CODE_LENGTH: 6,
};

const AWS_CONFIG = {
  region: process.env.REACT_APP_AWS_IDENTITY_REGION,
  userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
  authenticationFlowType: 'USER_PASSWORD_AUTH',
  oauth: {
    domain: process.env.REACT_APP_AWS_USER_POOL_DOMAIN,
    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: process.env.REACT_APP_WEB_URL + '/signin',
    redirectSignOut: process.env.REACT_APP_WEB_URL + '/signin',
    responseType: 'code',
  },
  cookieStorage: {
    domain: configs.REACT_APP_COOKIE_DOMAIN,
    secure: configs.NODE_ENV === 'test',
    path: '/',
    expires: 365,
  },
};

const CUSTOM_AWS_CONFIG = {
  ...AWS_CONFIG,
  authenticationFlowType: 'USER_PASSWORD_AUTH',
};

const PERMISSIONS = {
  DASHBOARD_PERMISSION: [],
  WED_ADMIN: ['web_admin:read', 'web_admin:create', 'web_admin:update', 'web_admin:delete'],
  USER_MANAGEMENT: ['user:read', 'user:create', 'user:update', 'user:delete'],
  ROLE_MANAGEMENT: ['role:read', 'role:create', 'role:update', 'role:delete'],
  PROPERTY_MANAGEMENT: ['property:read', 'property:create', 'property:update', 'property:delete'],
  PROPERTY_TYPE_MANAGEMENT: [
    'property_type:read',
    'property_type:create',
    'property_type:update',
    'property_type:delete',
  ],
  PERMISSION: ['permission:read', 'permission:create', 'permission:update', 'permission:delete'],
  FORM: ['form:read', 'form:create', 'form:update', 'form:delete'],
};

export default {
  ...configs,
  ...common,
  ...textLength,
  ...table,
  ...PERMISSIONS,
  AWS_CONFIG,
  CUSTOM_AWS_CONFIG,
};
