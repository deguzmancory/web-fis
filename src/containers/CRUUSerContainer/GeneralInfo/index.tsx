import { Box, Grid } from '@mui/material';
import React from 'react';
import { Checkbox, Input, InputPassword, Select, ValidatePassword } from 'src/components/common';
import { userTypeOptions } from 'src/containers/UsersManagement/TableList/CustomFilter/helpers';
import { isEmpty } from 'src/validations';
import { CRUUSER_KEY } from '../enums';
import { CRUUserFormikProps, getErrorMessage, isEditProfileMode, isEditUserMode } from '../helper';

const GeneralInfo: React.FC<Props> = ({ formikProps, isLoading }) => {
  const {
    values,
    errors,
    touched,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
    getUncontrolledFieldProps,
  } = formikProps;

  const isInEditUserMode = isEditUserMode(values.mode);
  const isInEditProfileMode = isEditProfileMode(values.mode);

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
              {...getUncontrolledFieldProps(CRUUSER_KEY.FIRST_NAME)}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label={'Last Name'}
              required
              errorMessage={_getErrorMessage(CRUUSER_KEY.LAST_NAME)}
              {...getUncontrolledFieldProps(CRUUSER_KEY.LAST_NAME)}
              disabled={isLoading}
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
              {...getUncontrolledFieldProps(CRUUSER_KEY.MIDDLE_NAME)}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={4}>
            <Input
              label={'Username'}
              required
              errorMessage={_getErrorMessage(CRUUSER_KEY.USERNAME)}
              {...getUncontrolledFieldProps(CRUUSER_KEY.USERNAME)}
              disabled={isInEditProfileMode || isLoading}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label={'Email'}
              required
              errorMessage={_getErrorMessage(CRUUSER_KEY.EMAIL)}
              {...getUncontrolledFieldProps(CRUUSER_KEY.EMAIL)}
              disabled={isLoading}
            />
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
              isDisabled={isEmpty(values.roles) || isLoading}
              infoTooltipMessage={
                isInEditUserMode
                  ? 'The selected user type will be the default when logging in.'
                  : 'Please select the user types available to this user below.'
              }
              infoToolTipWithArrow
            />
          </Grid>
          {isInEditProfileMode && (
            <>
              <Grid item xs={4}>
                <InputPassword
                  label="Current Password"
                  autoComplete="current-password"
                  placeholder="Current Password"
                  errorMessage={_getErrorMessage(CRUUSER_KEY.CURRENT_PASSWORD)}
                  {...getUncontrolledFieldProps(CRUUSER_KEY.CURRENT_PASSWORD)}
                />
              </Grid>
              <Grid item xs={4}>
                <InputPassword
                  label="New Password"
                  autoComplete="new-password"
                  placeholder="New Password"
                  errorMessage={_getErrorMessage(CRUUSER_KEY.NEW_PASSWORD)}
                  {...getFieldProps(CRUUSER_KEY.NEW_PASSWORD)}
                />
              </Grid>
            </>
          )}
          {(isInEditUserMode || isInEditProfileMode) && (
            <>
              <Grid item xs={4}>
                <Input
                  label={'Password Changed'}
                  // required
                  errorMessage={_getErrorMessage(CRUUSER_KEY.PASSWORD_SET_DATE)}
                  {...getUncontrolledFieldProps(CRUUSER_KEY.PASSWORD_SET_DATE)}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  label={'Last Login'}
                  errorMessage={_getErrorMessage(CRUUSER_KEY.LAST_LOGIN_DATE)}
                  {...getUncontrolledFieldProps(CRUUSER_KEY.LAST_LOGIN_DATE)}
                  disabled
                />
              </Grid>
            </>
          )}
          {isInEditProfileMode && values.newPassword && (
            <Grid item xs={4}>
              <Box
                sx={{
                  transform: 'translateY(-24px)',
                }}
              >
                <ValidatePassword className="" password={values.newPassword} />
              </Box>
            </Grid>
          )}
        </Grid>
        {isInEditUserMode && (
          <Grid item container spacing={3}>
            <Grid item xs={4}>
              <Checkbox.Item
                label="Login Disabled"
                {...getFieldProps(CRUUSER_KEY.STATUS)}
                disabled={isLoading}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default GeneralInfo;
