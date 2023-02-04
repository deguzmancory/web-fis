export interface MyProfile {
  allowMaintenanceModeLogin: boolean;
  comments: string;
  createdAt: string;
  currentRole: string | null;
  defaultUserType: string;
  email: string;
  firstName: string;
  fisFaInfo: any; //TODO: tin_pham update type
  fisPiInfo: any; //TODO: tin_pham update type
  fisSuInfo: any; //TODO: tin_pham update type
  fullName: string;
  id: string;
  isDhUser: boolean;
  lastLoginDate: string | null;
  lastName: string;
  middleName: string;
  passwordResetRequired: boolean;
  passwordSetDate: string;

  roles: {
    userId: string;
    roleId: string;
    createdAt: string;
    updatedAt: string;
    role: {
      id: string;
      name: string;
      displayName: string;
      description: string;
    };
  }[];
  status: string;
  updatedAt: string;
  username: string;
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

export type UpdateCurrentRoleProfilePayload = {
  roleName: string;
};

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
