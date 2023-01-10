export enum PermissionAction {
  CREATE = 'C',
  READ = 'R',
  UPDATE = 'U',
  DELETE = 'D',
}

export const transformPermission = (permission: {
  resourceName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}): string => {
  const permissionAction = Object.keys(permission).find((key) => permission[`${key}`] === true);
  switch (permissionAction) {
    case 'canCreate':
      return `${permission.resourceName.toUpperCase()}:${PermissionAction.CREATE}`;
    case 'canRead':
      return `${permission.resourceName.toUpperCase()}:${PermissionAction.READ}`;
    case 'canUpdate':
      return `${permission.resourceName.toUpperCase()}:${PermissionAction.UPDATE}`;
    case 'canDelete':
      return `${permission.resourceName.toUpperCase()}:${PermissionAction.DELETE}`;
    default:
      return '';
  }
};
