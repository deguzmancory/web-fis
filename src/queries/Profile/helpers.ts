export enum ROLE_NAME {
  CENTRAL = 'CENTRAL',
  PI = 'PI',
  SU = 'SU',
  FA = 'FA',
}

export const getRoleName = (role: string) => {
  switch (role) {
    case ROLE_NAME.CENTRAL:
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
