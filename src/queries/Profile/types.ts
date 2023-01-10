export interface MyProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  fullName: string;
  username: string;
  email: string;
  lastLoginDate: string | null;
  isDhUser: boolean;
  allowMaintenanceModeLogin: boolean;
  accountDisabled: boolean;
  passwordSetDate: string;
  comments: string;
  defaultRoleCode: string;
  defaultUserType: string;
  status: string;
  fisPiInfo: any;
  fisSuInfo: any;
  roleName?: string;
}

export interface ProfilePayload {
  phoneNumber: string;
  mailingAddress: string;
  country: string;
  zipCode: string;
  city: string;
  state: string;
  careOf: string;
}
