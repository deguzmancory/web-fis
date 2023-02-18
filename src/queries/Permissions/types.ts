export type PermissionCu = {
  id: number;
  createdAt: string;
  updatedAt: string;
  resourceName: string;
  displayName: string;
  description: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  isCuPermission: boolean;
  permissionGroupId: number;
};

export type PermissionCuResponse = {
  totalRecords: number;
  data: PermissionCu[];
  payloadSize: number;
  hasNext: boolean;
};
