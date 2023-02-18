import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { Accordion, Checkbox, RadioButton } from 'src/components/common';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import { useGetPermissionCu } from 'src/queries/Permissions';
import ReactJson from 'react-json-view';
import {
  optionsPermissionCuUserManagement,
  PERMISSION_CU_LABEL,
  PERMISSION_CU_VALUE,
} from './helpers';
import { CUPermission } from 'src/queries/Users/types';
import _ from 'lodash';
import { CRUUSER_KEY } from 'src/containers/CRUUSerContainer/enums';
const CUDetails: React.FC<Props> = ({ formikProps }) => {
  const { values, setFieldValue } = formikProps;
  console.log('values: ', values);
  const permissions = values?.permissions;

  const { permissionsCu, loading } = useGetPermissionCu({
    onSuccess(data) {},
    onError(err) {},
  });

  const isLoading = React.useMemo(() => {
    return loading;
  }, [loading]);

  const handleCheckboxChange = (value: boolean, id: number) => {
    let updatedPermissions: CUPermission[] = [...permissions];
    const clonePermissions = _.cloneDeep(permissions);

    if (value) {
      // add the permission to the array if it doesn't already exist
      if (!clonePermissions.some((permission) => permission.permissionId === id)) {
        updatedPermissions.push({
          permissionId: id,
        });
      }
    } else {
      // remove the permission from the array if it exists
      updatedPermissions = clonePermissions.filter((permission) => permission.permissionId !== id);
    }
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

  const renderCheckbox = (name: PERMISSION_CU_LABEL) => {
    return (
      <Checkbox.Item
        label={name}
        value={valueCheckbox(name)}
        checked={statusCheckbox(name)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.checked;
          return handleCheckboxChange(value, valueCheckbox(name));
        }}
        disabled={isLoading}
      />
    );
  };

  const valueRadioUserManagement = React.useCallback(() => {
    // return All
    // return non cu
    // return view only
    return PERMISSION_CU_VALUE.ALL;
  }, []);

  const handleRadioButtonChange = (value: boolean) => {
    console.log('value: ', value);
    // setFieldValue(CRUUSER_KEY.PERMISSIONS, updatedPermissions);
  };

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
          {renderCheckbox(PERMISSION_CU_LABEL.VIEW_VENDOR_MASTER_RECORDS)}
          {renderCheckbox(PERMISSION_CU_LABEL.EDIT_VENDOR_MASTER_RECORDS)}
        </Grid>
        <Grid item xs={4}>
          <RadioButton
            label="User Management"
            columns={1}
            options={optionsPermissionCuUserManagement}
            containerClassName="element-title-bold"
            value={valueRadioUserManagement()}
            onChange={(name, value) => {
              return handleRadioButtonChange(value);
            }}
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
        </Grid>
      </Grid>
      <Accordion title="Permission CU Lists" isExpanded>
        {permissionsCu && <ReactJson src={permissionsCu} />}
      </Accordion>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
};
export default CUDetails;
