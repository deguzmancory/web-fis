import { Box, Grid, Typography } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { Checkbox, RadioButton } from 'src/components/common';
import { CRUUSER_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps, isEditProfileMode } from 'src/containers/CRUUSerContainer/helper';
import { PERMISSION_VALUE, useGetPermissionCu } from 'src/queries/Permissions';
import { CUPermission } from 'src/queries/Users/types';
import {
  optionsPermissionCuUserManagement,
  PERMISSION_CU_LABEL,
  PERMISSION_CU_OPTION_VALUE,
} from './helpers';
const CUDetails: React.FC<Props> = ({ formikProps }) => {
  const { values, setFieldValue } = formikProps;
  const permissions = values?.permissions;
  const isInEditProfileMode = isEditProfileMode(values.mode);

  const { permissionsCu, loading } = useGetPermissionCu({
    onSuccess(data) {},
    onError(err) {},
    suspense: true,
  });

  const isLoading = React.useMemo(() => {
    return loading;
  }, [loading]);

  const handleCheckboxChange = (value: boolean, id: number) => {
    let updatedPermissions: CUPermission[] = [...permissions];
    const clonePermissions = _.cloneDeep(permissions);

    if (value) {
      const isViewVendorMasterRecords =
        valueCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_MASTER_RECORDS) === id;

      const isEditVendorMasterRecords =
        valueCheckbox(PERMISSION_CU_LABEL.EDIT_VENDOR_MASTER_RECORDS) === id;

      if (isEditVendorMasterRecords) {
        // Check isEditVendorMasterRecords >> remove VIEW_VENDOR_MASTER_RECORDS
        updatedPermissions = clonePermissions.filter(
          (permission) =>
            permission.permissionId !==
            valueCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_MASTER_RECORDS)
        );
      } else if (isViewVendorMasterRecords) {
        // Check isViewVendorMasterRecords >> remove EDIT_VENDOR_MASTER_RECORDS
        updatedPermissions = clonePermissions.filter(
          (permission) =>
            permission.permissionId !==
            valueCheckbox(PERMISSION_CU_LABEL.EDIT_VENDOR_MASTER_RECORDS)
        );
      }

      // add the permission to the array if it doesn't already exist
      if (!clonePermissions.some((permission) => permission.permissionId === id)) {
        updatedPermissions.push({
          permissionId: id,
        });
      }
    } else {
      const isViewVendorList = valueCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_LIST) === id;
      if (isViewVendorList) {
        // Uncheck View Vendor List >> remove VIEW_VENDOR_MASTER_RECORDS && EDIT_VENDOR_MASTER_RECORDS also
        updatedPermissions = clonePermissions.filter(
          (permission) =>
            permission.permissionId !==
              valueCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_MASTER_RECORDS) &&
            permission.permissionId !==
              valueCheckbox(PERMISSION_CU_LABEL.EDIT_VENDOR_MASTER_RECORDS) &&
            permission.permissionId !== id
        );
      } else {
        // remove the permission from the array if it exists
        updatedPermissions = clonePermissions.filter(
          (permission) => permission.permissionId !== id
        );
      }
    }
    // setFieldValue(CRUUSER_KEY.PERMISSIONS, _.uniqBy(updatedPermissions, 'permissionId'));
    setFieldValue(CRUUSER_KEY.PERMISSIONS, updatedPermissions);
  };

  const valueCheckbox = React.useCallback(
    (name: PERMISSION_CU_LABEL) => {
      if (!permissionsCu) return -1;
      return permissionsCu.find((permission) => permission.description.includes(name))?.id;
    },
    [permissionsCu]
  );

  const statusCheckbox = React.useCallback(
    (name: PERMISSION_CU_LABEL) => {
      if (!permissionsCu || !name) return false;
      return permissions.some((permission) => permission.permissionId === valueCheckbox(name));
    },
    [permissions, permissionsCu, valueCheckbox]
  );

  const renderCheckbox = (
    name: PERMISSION_CU_LABEL,
    options?: {
      disabled: boolean;
    }
  ) => {
    return (
      <Checkbox.Item
        label={name}
        value={valueCheckbox(name)}
        checked={statusCheckbox(name)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.checked;
          return handleCheckboxChange(value, valueCheckbox(name));
        }}
        disabled={isLoading || isInEditProfileMode || options?.disabled}
      />
    );
  };

  const getPermissionIds = React.useCallback(
    (permissions: PERMISSION_VALUE[]) => {
      if (!permissionsCu) return new Set([]);

      const permissionIds: number[] = [];
      permissions.forEach((permission) => {
        const permissionCu = permissionsCu.find((p) => p.displayName === permission);
        if (permissionCu) permissionIds.push(permissionCu.id);
      });
      return new Set(permissionIds);
    },
    [permissionsCu]
  );

  const permissionUserManagementIds = React.useMemo(() => {
    return {
      [PERMISSION_CU_OPTION_VALUE.ALL]: getPermissionIds([
        PERMISSION_VALUE.ALLOW_CREATE_USER,
        PERMISSION_VALUE.ALLOW_READ_USER,
        PERMISSION_VALUE.ALLOW_UPDATE_USER,
        PERMISSION_VALUE.ALLOW_UPDATE_CU_USER,
        PERMISSION_VALUE.ALLOW_DELETE_USER,
      ]),
      [PERMISSION_CU_OPTION_VALUE.NON_CENTRAL_USERS]: getPermissionIds([
        PERMISSION_VALUE.ALLOW_CREATE_USER,
        PERMISSION_VALUE.ALLOW_READ_USER,
        PERMISSION_VALUE.ALLOW_UPDATE_USER,
        PERMISSION_VALUE.ALLOW_DELETE_USER,
      ]),
      [PERMISSION_CU_OPTION_VALUE.VIEW_ONLY]: getPermissionIds([PERMISSION_VALUE.ALLOW_READ_USER]),
    };
  }, [getPermissionIds]);

  const permissionsUserManagementWithRole = React.useMemo(() => {
    return {
      [PERMISSION_CU_OPTION_VALUE.ALL]: [
        PERMISSION_VALUE.ALLOW_CREATE_USER,
        PERMISSION_VALUE.ALLOW_READ_USER,
        PERMISSION_VALUE.ALLOW_UPDATE_USER,
        PERMISSION_VALUE.ALLOW_UPDATE_CU_USER,
        PERMISSION_VALUE.ALLOW_DELETE_USER,
      ],
      [PERMISSION_CU_OPTION_VALUE.NON_CENTRAL_USERS]: [
        PERMISSION_VALUE.ALLOW_CREATE_USER,
        PERMISSION_VALUE.ALLOW_READ_USER,
        PERMISSION_VALUE.ALLOW_UPDATE_USER,
        PERMISSION_VALUE.ALLOW_DELETE_USER,
      ],
      [PERMISSION_CU_OPTION_VALUE.VIEW_ONLY]: [PERMISSION_VALUE.ALLOW_READ_USER],
    };
  }, []);

  const getListsIdFromPermissionType = React.useCallback(
    (arr: PERMISSION_VALUE[]) => {
      if (!permissionsCu) return [];
      return permissionsCu
        .filter((permissionCu) => arr.includes(permissionCu.displayName as PERMISSION_VALUE))
        .map((permissionCu) => ({ permissionId: permissionCu.id }));
    },
    [permissionsCu]
  );

  const handleRadioButtonChange = React.useCallback(
    (value: PERMISSION_CU_OPTION_VALUE) => {
      if (!permissionsCu || !permissions || !value) return null;

      let before: CUPermission[] = [...permissions];
      let updatedPermissions: CUPermission[] = before.filter(
        (permission) =>
          !permissionUserManagementIds[PERMISSION_CU_OPTION_VALUE.ALL].has(permission.permissionId)
      );
      const uniquePermissions = () => {
        return _.uniqBy(
          [
            ...updatedPermissions,
            ...getListsIdFromPermissionType(permissionsUserManagementWithRole[`${value}`]),
          ],
          'permissionId'
        );
      };

      const newPermissions = uniquePermissions();
      return setFieldValue(CRUUSER_KEY.PERMISSIONS, newPermissions);
    },
    [
      permissionsCu,
      permissions,
      permissionUserManagementIds,
      permissionsUserManagementWithRole,
      setFieldValue,
      getListsIdFromPermissionType,
    ]
  );

  const valueRadioUserManagement = React.useCallback(() => {
    const isHavePermissionMap = new Map();
    const isHavePermission = (permissionName) => {
      if (!permissions || !permissionsCu) return false;
      if (isHavePermissionMap.has(permissionName)) {
        return isHavePermissionMap.get(permissionName);
      }
      const permissionCuId = permissionsCu.find(
        (permission) => permission.displayName === permissionName
      )?.id;
      const result = permissions
        .map((permission) => permission.permissionId)
        .includes(permissionCuId);
      isHavePermissionMap.set(permissionName, result);
      return result;
    };
    if (
      isHavePermission(PERMISSION_VALUE.ALLOW_CREATE_USER) &&
      isHavePermission(PERMISSION_VALUE.ALLOW_READ_USER) &&
      isHavePermission(PERMISSION_VALUE.ALLOW_UPDATE_USER) &&
      isHavePermission(PERMISSION_VALUE.ALLOW_DELETE_USER) &&
      isHavePermission(PERMISSION_VALUE.ALLOW_UPDATE_CU_USER)
    ) {
      return PERMISSION_CU_OPTION_VALUE.ALL;
    } else if (
      isHavePermission(PERMISSION_VALUE.ALLOW_CREATE_USER) &&
      isHavePermission(PERMISSION_VALUE.ALLOW_READ_USER) &&
      isHavePermission(PERMISSION_VALUE.ALLOW_UPDATE_USER) &&
      isHavePermission(PERMISSION_VALUE.ALLOW_DELETE_USER) &&
      !isHavePermission(PERMISSION_VALUE.ALLOW_UPDATE_CU_USER)
    ) {
      return PERMISSION_CU_OPTION_VALUE.NON_CENTRAL_USERS;
    } else if (isHavePermission(PERMISSION_VALUE.ALLOW_READ_USER)) {
      return PERMISSION_CU_OPTION_VALUE.VIEW_ONLY;
    } else {
      return null;
    }
  }, [permissions, permissionsCu]);

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Access Roles Granted
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {renderCheckbox(PERMISSION_CU_LABEL.APPROVAL_OF_POS_AND_PAYMENTS_OVER_24999)}
          <Box mb={2} />

          {renderCheckbox(PERMISSION_CU_LABEL.PRINT_CHECKS)}
          {renderCheckbox(PERMISSION_CU_LABEL.VIEW_CHECK_REGISTERS)}
          <Box mb={2} />

          {renderCheckbox(PERMISSION_CU_LABEL.EDIT_STAFF_LISTING)}
        </Grid>
        <Grid item xs={4}>
          {renderCheckbox(PERMISSION_CU_LABEL.RCUH_PAYROLL_REPORT)}
          {renderCheckbox(PERMISSION_CU_LABEL.FINANCIAL_FORECAST_PAYROLL_REPORT)}
          {renderCheckbox(PERMISSION_CU_LABEL.VACATION_AND_SICK_LEAVE_AUDIT_PAGE)}
          <Box mb={2} />

          {renderCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_LIST)}
          {renderCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_MASTER_RECORDS, {
            disabled: !statusCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_LIST),
          })}
          {renderCheckbox(PERMISSION_CU_LABEL.EDIT_VENDOR_MASTER_RECORDS, {
            disabled: !statusCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_LIST),
          })}
        </Grid>
        <Grid item xs={4}>
          <RadioButton
            label="User Management"
            columns={1}
            options={optionsPermissionCuUserManagement}
            containerClassName="element-title-bold"
            value={valueRadioUserManagement()}
            onChange={(_name, value) => {
              return handleRadioButtonChange(value);
            }}
            disabled={isLoading || isInEditProfileMode}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
};

export default React.memo(CUDetails, (prevProps, nextProps) => {
  const prevPermissionsValues = prevProps.formikProps.values.permissions;
  const nextPermissionsValues = nextProps.formikProps.values.permissions;
  return _.isEqual(prevPermissionsValues, nextPermissionsValues);
});
