export const PATHS = {
  root: '/',
  dev: '/dev',
  welcome: '/welcome',
  signIn: '/login',
  signUp: '/sign-up',
  event: '/event',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  myAccount: '/my-accounts',
  dashboard: '/dashboard',
  logout: '/logout',

  // ======== Profile ========
  myProfile: '/me',
  changePassword: '/me/change-password',
  editMyProfile: '/me/edit',
  configureNotification: '/me/notification',
};

export const PATH_HEADERS = {
  [PATHS.myProfile]: 'My Profile',
  [PATHS.editMyProfile]: 'My Profile',
  [PATHS.changePassword]: 'Change Password', // pragma: allowlist secret
};

export const HIDE_NAV_PATHS = [];
