export const PATHS = {
  root: '/',
  dev: '/dev',
  welcome: '/welcome',
  signIn: '/login',
  myAccount: '/my-accounts',
  dashboard: '/dashboard',
  logout: '/logout',

  // Profile
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
  purchaseOrderDetail: '/purchase-orders/detail',
  submittedPurchaseOrder: '/purchase-orders/submitted',
  poAdditionalForm: `/purchase-orders/additional-form`,

  // miscellaneous / Global settings
  globalSettings: '/global-settings',
  expiredPassword: '/expired-password',

  // miscellaneous / Vendors
  vendors: '/miscellaneous/vendors',
  addVendorMaster: '/miscellaneous/vendors/vendor-master/add',
  editVendorMaster: '/miscellaneous/vendors/vendor-master/edit',
  addVendorRegistration: '/miscellaneous/vendors/vendor-registration/add',
  viewVendorRegistration: '/miscellaneous/vendors/vendor-registration/edit',
};

export const PATH_HEADERS = {
  [PATHS.myProfile]: 'My Profile',
  [PATHS.editMyProfile]: 'My Profile',
  [PATHS.changePassword]: 'Change Password', // pragma: allowlist secret
};

export const HIDE_NAV_PATHS = [];
