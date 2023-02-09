import { Box, Grid } from '@mui/material';
import React from 'react';
import { Checkbox } from 'src/components/common';
import { userTypeOptions } from 'src/containers/UsersManagement/TableList/CustomFilter/helpers';
import { CRUUSER_KEY } from '../../enums';
import { CRUUserFormikProps, getErrorMessage, isEditProfileMode } from '../../helper';

const SelectUserType: React.FC<Props> = ({ formikProps, isLoading }) => {
  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;
  const isInEditProfileMode = isEditProfileMode(values.mode);

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
            disabled={isInEditProfileMode || isLoading}
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
