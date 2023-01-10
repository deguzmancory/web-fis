export const getRoleName = (role: string) => {
  switch (role) {
    case 'PI':
      return 'Principal Investigator';
    case 'Central':
      return 'Central User';
    default:
      return 'Unknown';
  }
};
