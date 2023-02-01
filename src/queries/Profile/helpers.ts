export enum ROLE_NAME {
  CU = 'CU',
  PI = 'PI',
  SU = 'SU',
  FA = 'FA',
}

export const getRoleName = (role: string) => {
  switch (role) {
    case ROLE_NAME.CU:
      return 'Central User';
    case ROLE_NAME.PI:
      return 'Principal Investigator';
    case ROLE_NAME.SU:
      return 'Secondary User';
    case ROLE_NAME.FA:
      return 'Fiscal Administrator';
    default:
      return 'Unknown';
  }
};

export const getRoleNamePayload = (role: string) => {
  if (role === ROLE_NAME.CU || role === getRoleName(ROLE_NAME.CU)) {
    return ROLE_NAME.CU;
  } else if (role === ROLE_NAME.PI || role === getRoleName(ROLE_NAME.PI)) {
    return ROLE_NAME.PI;
  } else if (role === ROLE_NAME.SU || role === getRoleName(ROLE_NAME.SU)) {
    return ROLE_NAME.SU;
  } else if (role === ROLE_NAME.FA || role === getRoleName(ROLE_NAME.FA)) {
    return ROLE_NAME.FA;
  }
};

export const isCU = (role: string) => {
  return role === ROLE_NAME.CU || role === getRoleName(ROLE_NAME.CU);
};
export const isPI = (role: string) => {
  return role === ROLE_NAME.PI || role === getRoleName(ROLE_NAME.PI);
};
export const isSU = (role: string) => {
  return role === ROLE_NAME.SU || role === getRoleName(ROLE_NAME.SU);
};
export const isFA = (role: string) => {
  return role === ROLE_NAME.FA || role === getRoleName(ROLE_NAME.FA);
};
