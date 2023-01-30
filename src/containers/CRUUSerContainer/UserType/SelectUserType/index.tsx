import { Box, Grid } from '@mui/material';
import React from 'react';
import { Checkbox } from 'src/components/common';
import { userTypeOptions } from 'src/containers/UsersManagement/TableList/CustomFilter/helpers';
import { CRUUserFormikProps, CRUUSER_KEY, getErrorMessage } from '../../helper';

const SelectUserType: React.FC<Props> = ({ formikProps, isLoading }) => {
  const { errors, touched, getFieldProps, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName: CRUUSER_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };
  const handleCheckboxChange = (name: CRUUSER_KEY, value: any[]) => {
    setFieldValue(name, value);
    setFieldValue(CRUUSER_KEY.DEFAULT_USER_TYPE, value[0]);
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Checkbox.Group
            label={null}
            options={userTypeOptions}
            columns={4}
            {...getFieldProps(CRUUSER_KEY.ROLES)}
            onChange={handleCheckboxChange}
            errorMessage={_getErrorMessage(CRUUSER_KEY.ROLES)}
            disabled={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default SelectUserType;
