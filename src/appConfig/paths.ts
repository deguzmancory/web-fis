export const PATHS = {
  root: '/',
  dev: '/dev',
  welcome: '/welcome',
  signIn: '/login',
  myAccount: '/my-accounts',
  dashboard: '/dashboard',
  logout: '/logout',

  // ======== Profile ========
  myProfile: '/me',
  changePassword: '/me/change-password',
  editMyProfile: '/me/edit',
  configureNotification: '/me/notification',

  // miscellaneous / Users Managements
  userManagements: '/miscellaneous/user-managements',
  addUser: '/miscellaneous/user-managements/add',
  userDetail: '/miscellaneous/user-managements/user-detail',
};

export const PATH_HEADERS = {
  [PATHS.myProfile]: 'My Profile',
  [PATHS.editMyProfile]: 'My Profile',
  [PATHS.changePassword]: 'Change Password', // pragma: allowlist secret
};

export const HIDE_NAV_PATHS = [];
