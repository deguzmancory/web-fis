import { Box, Grid } from '@mui/material';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Checkbox } from 'src/components/common';
import { userTypeOptions } from 'src/containers/UsersManagement/TableList/CustomFilter/helpers';
import { CRUUSER_KEY, USER_TYPE_KEY } from '../../enums';
import { CRUUserFormikProps, getErrorMessage, isEditProfileMode } from '../../helper';

const SelectUserType: React.FC<Props> = ({ formikProps, isLoading }) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;
  const isInEditProfileMode = isEditProfileMode(values.mode);

  const _getErrorMessage = (fieldName: CRUUSER_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };
  const handleCheckboxChange = (name: CRUUSER_KEY, value: any[]) => {
    setFieldValue(name, value);
    setFieldValue(CRUUSER_KEY.DEFAULT_USER_TYPE, value[0]);

    query.set(USER_TYPE_KEY.TAB, value[0]);
    history.push({ search: query.toString() });
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
