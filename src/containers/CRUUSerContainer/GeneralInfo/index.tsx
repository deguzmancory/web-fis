import { Box, Grid } from '@mui/material';
import React from 'react';
import { Checkbox, Input, Select } from 'src/components/common';
import { userTypeOptions } from 'src/containers/UsersManagement/TableList/CustomFilter/helpers';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps, CRUUSER_KEY, getErrorMessage } from '../helper';

const GeneralInfo: React.FC<Props> = ({ formikProps }) => {
  const { values, errors, touched, getFieldProps, setFieldValue, setFieldTouched } = formikProps;

  const _getErrorMessage = (fieldName: CRUUSER_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item container spacing={3}>
          <Grid item xs={4}>
            <Input
              label={'First Name'}
              required
              errorMessage={_getErrorMessage(CRUUSER_KEY.FIRST_NAME)}
              {...getFieldProps(CRUUSER_KEY.FIRST_NAME)}
            />
          </Grid>
          <Grid item xs={4} container spacing={3}>
            <Grid item xs={8}>
              <Input
                label={'Last Name'}
                required
                errorMessage={_getErrorMessage(CRUUSER_KEY.LAST_NAME)}
                {...getFieldProps(CRUUSER_KEY.LAST_NAME)}
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                label={'MI'}
                maxLength={5}
                infoToolTipWithArrow
                infoTooltipMessage="Middle Initial"
                infoTooltipPlacement="right-end"
                errorMessage={_getErrorMessage(CRUUSER_KEY.MIDDLE_NAME)}
                {...getFieldProps(CRUUSER_KEY.MIDDLE_NAME)}
              />
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Select
              name={CRUUSER_KEY.DEFAULT_USER_TYPE}
              options={userTypeOptions}
              filterOption={(option) => values.roles.includes(option.value)}
              {...getFieldProps(CRUUSER_KEY.DEFAULT_USER_TYPE)}
              label="Default User Type"
              hideSearchIcon
              required
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              errorMessage={_getErrorMessage(CRUUSER_KEY.DEFAULT_USER_TYPE)}
              isDisabled={isEmpty(values.roles)}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label={'Username'}
              required
              errorMessage={_getErrorMessage(CRUUSER_KEY.USERNAME)}
              {...getFieldProps(CRUUSER_KEY.USERNAME)}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label={'Email'}
              required
              errorMessage={_getErrorMessage(CRUUSER_KEY.EMAIL)}
              {...getFieldProps(CRUUSER_KEY.EMAIL)}
            />
          </Grid>
          {values.isViewMode && (
            <>
              <Grid item xs={4}>
                <Input
                  label={'Last Login'}
                  required
                  errorMessage={_getErrorMessage(CRUUSER_KEY.LAST_LOGIN_DATE)}
                  {...getFieldProps(CRUUSER_KEY.LAST_LOGIN_DATE)}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  label={'Password Changed'}
                  required
                  errorMessage={_getErrorMessage(CRUUSER_KEY.PASSWORD_SET_DATE)}
                  {...getFieldProps(CRUUSER_KEY.PASSWORD_SET_DATE)}
                  disabled
                />
              </Grid>
            </>
          )}
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={4}>
            <Checkbox.Item label="Login Disabled" {...getFieldProps(CRUUSER_KEY.STATUS)} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
};
export default GeneralInfo;