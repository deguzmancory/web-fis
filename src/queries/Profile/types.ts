import {
  AuditInformation,
  DelegateAccess,
  DelegatedAccess,
  User,
  USER_STATUS,
} from '../Users/types';

/*** General ***/
export interface MyProfile {
  allowMaintenanceModeLogin: boolean;
  comments: string;
  createdAt: string;
  currentRole: string | null;
  defaultUserType: string;
  email: string;
  firstName: string;
  fisFaInfo: FisFAInfo; //TODO: tin_pham update type
  fisPiInfo: FisFIInfo; //TODO: tin_pham update type
  fisSuInfo: FisFUInfo; //TODO: tin_pham update type
  fullName: string;
  id: string;
  isDhUser: boolean;
  lastLoginDate: string | null;
  lastName: string;
  middleName: string;
  passwordResetRequired: boolean;
  passwordSetDate: string;

  updatedAt: string;
  username: string;

  roles: {
    userId: User['id'];
    roleId: ProfileRole['id'];
    createdAt: string;
    updatedAt: string;
    role: ProfileRole;
  }[];
  status: USER_STATUS;
  delegateAccesses: DelegateAccess[];
  delegatedAccesses: DelegatedAccess[];
  userAuditTrails: AuditInformation[];
}

export interface ProfileRole {
  description: string;
  displayName: string;
  id: string;
  name: string;
}

export interface FisFAInfo {
  faCode: string;
  sendInvoiceTo: string;
  sendInvoiceToEmail: string;
  department: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressZip4: string;
  addressCountry: string;
  remittanceName: string;
  remittancePhoneNumber: string;
}

export interface FisFIInfo {
  piCode: string;
  directInquiriesTo: string;
  phoneNumber: string;
  faStaffToReview: string;
  sendInvoiceTo: string;
  sendInvoiceToEmail: string;
  department: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressZip4: string;
  addressCountry: string;
  remittanceName: string;
  remittancePhoneNumber: string;
}

export interface FisFUInfo {
  directInquiriesTo: string;
  faStaffToReview: string;
  sendInvoiceTo: string;
  sendInvoiceToEmail: string;
  phoneNumber: string;
  department: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressZip4: string;
  addressCountry: string;
  remittanceName: string;
  remittancePhoneNumber: string;
}

/*** Update Current Role Profile ***/
export type UpdateCurrentRoleProfilePayload = {
  roleName: string;
};

/*** Get Delegation Accesses ***/
export type GrantedAccesses = MyAccesses & {
  delegatedUser: {
    id: string;
    fullName: string;
    email: string;
    username: string;
  };
};

export type MyAccesses = {
  id: string;
  userId: string;
  delegatedUserId: string;
  roleId: string;
  startDate: string;
  endDate: string;
  isAllProjects: boolean;
  projectNumber: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    username: string;
  };
  userRole: {
    userId: string;
    roleId: string;
    createdAt: string;
    updatedAt: string;
    role: {
      id: string;
      name: string;
    };
  };
};

export type DelegationAccessResponse = {
  grantedAccesses: GrantedAccesses[];
  myAccesses: MyAccesses[];
};

export type GetTokenDelegationPayload = {
  accessId: string;
  fullName: string;
  username: string;
  roleName: string;
};

/*** Update profile ***/
export interface UpdateProfilePayload {
  firstName: MyProfile['firstName'];
  lastName: MyProfile['lastName'];
  middleName: MyProfile['middleName'];
  email: MyProfile['email'];
  comments: MyProfile['comments'];
  defaultUserType: MyProfile['defaultUserType'];
  isDhUser: MyProfile['isDhUser'];
  status: MyProfile['status'];
  newPassword: string;
  currentPassword: string;
  roles: string[];
  delegateAccess: DelegateAccess[];
  fisFaInfo: FisFAInfo;
  fisPiInfo: FisFIInfo;
  fisSuInfo: FisFUInfo;
}
