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
  switchUser: '/switch-user',

  // miscellaneous / Users Managements
  userManagements: '/miscellaneous/user-managements',
  addUser: '/miscellaneous/user-managements/add',
  userDetail: '/miscellaneous/user-managements/user-detail',

  // Purchase Order
  createPurchaseOrders: '/purchase-orders/create',
  additionalForm: `/purchase-orders/additional-form`,

  // miscellaneous / Global settings
  globalSettings: '/global-settings',
  expiredPassword: '/expired-password',

  // Vendors
  vendors: '/miscellaneous/vendors',
  addVendor: '/miscellaneous/vendors/add',
  vendorDetail: '/miscellaneous/vendors/vendor-detail',
};

export const PATH_HEADERS = {
  [PATHS.myProfile]: 'My Profile',
  [PATHS.editMyProfile]: 'My Profile',
  [PATHS.changePassword]: 'Change Password', // pragma: allowlist secret
};

export const HIDE_NAV_PATHS = [];
