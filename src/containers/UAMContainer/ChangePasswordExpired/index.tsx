import { Box, Grid, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useFormik } from 'formik';
import React from 'react';
import { Button, Form, Input, InputPassword, ValidatePassword } from 'src/components/common';
import {
  ChangePasswordPayload,
  GLOBAL_SETTING_KEY,
  useChangePassword,
  useGlobalSettings,
  useLogout,
  useProfile,
} from 'src/queries';
import { useUpdateProfilePasswordResetRequired } from 'src/queries/Profile/useUpdateProfilePasswordResetRequired';
import { useUpdateUserLastPasswordChanged } from 'src/queries/Users';
import { ErrorService } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import {
  changePasswordFormSchema,
  ChangePasswordFormValue,
  CHANGE_PASSWORD_KEY,
  initialChangePasswordFormValue,
} from './helpers';
import PasswordUpdated from './passwordUpdated';

const ChangePasswordExpired: React.FC<Props> = () => {
  const {
    globalSettings,
    getAllGlobalSettings,
    loading: isLoadingGlobalSettings,
  } = useGlobalSettings();
  React.useEffect(() => {
    if (!globalSettings) {
      getAllGlobalSettings();
    }
  }, [getAllGlobalSettings, globalSettings]);

  const passwordExpiredValue = globalSettings?.find(
    (setting) => setting.settingName === GLOBAL_SETTING_KEY.PASSWORD_RESET_MONTHS
  )?.settingValue;

  const { mainProfile, loading: isLoadingProfile } = useProfile();

  const [isPasswordUpdated, setIsPasswordUpdated] = React.useState(false);

  const { updateUserLastPasswordChanged } = useUpdateUserLastPasswordChanged();
  const { updateProfilePasswordResetRequired, isLoading: isLoadingPasswordResetRequired } =
    useUpdateProfilePasswordResetRequired({
      onSuccess(data, variables, context) {
        setIsPasswordUpdated(true);
      },
    });
  const { changePassword, isLoading: isLoadingChangePassword } = useChangePassword({
    onSuccess() {
      updateUserLastPasswordChanged({ username: mainProfile.username });
      updateProfilePasswordResetRequired({});
    },
    onError(error) {
      if (error) {
        handleError(error);
      } else {
        // TODO: tin_pham fix, change password return 200, but it still run into onError, with error undefined
        updateUserLastPasswordChanged({ username: mainProfile.username });
        updateProfilePasswordResetRequired({});
      }
    },
  });

  const handleError = (error) => {
    switch (error?.code) {
      case ErrorService.TYPES.NotAuthorizedException:
        return setFieldError(
          CHANGE_PASSWORD_KEY.CURRENT_PASSWORD,
          'Current Password does not match.'
        ); // pragma: allowlist secret
      case ErrorService.TYPES.InvalidPasswordException:
        return setFieldError(
          CHANGE_PASSWORD_KEY.NEW_PASSWORD,
          error.message.includes(':') ? error.message.split(':')[1] : error.message // pragma: allowlist secret
        );
      default:
        return handleShowErrorMsg(error);
    }
  };

  const handleSubmitChangePassword = (values: ChangePasswordFormValue) => {
    const { newPassword, confirmPassword, currentPassword } = values;

    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (newPassword === currentPassword) {
      setFieldError(
        CHANGE_PASSWORD_KEY.NEW_PASSWORD,
        'New Password must be different from Current Password.'
      ); // pragma: allowlist secret

      return;
    }
    if (newPassword !== confirmPassword) {
      setFieldError(
        CHANGE_PASSWORD_KEY.CONFIRM_PASSWORD,
        'Password and Confirm Password do not match.'
      ); // pragma: allowlist secret
      return;
    } else {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          const body: ChangePasswordPayload = {
            user: user,
            currentPassword: currentPassword,
            newPassword: newPassword,
          };
          return changePassword(body);
        })
        .catch((error) => handleShowErrorMsg(error));
    }
  };

  const { values, errors, touched, getFieldProps, handleSubmit, setFieldError } = useFormik({
    initialValues: initialChangePasswordFormValue,
    onSubmit: handleSubmitChangePassword,
    validationSchema: changePasswordFormSchema,
  });

  const getErrorMessage = (fieldName: CHANGE_PASSWORD_KEY) => {
    // eslint-disable-next-line security/detect-object-injection
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
  };

  const { logout, isLoggingOut } = useLogout();
  const handleBackToLogin = () => {
    logout();
  };

  const loading = React.useMemo(() => {
    return (
      isLoadingGlobalSettings ||
      isLoadingProfile ||
      isLoadingChangePassword ||
      isLoadingPasswordResetRequired
    );
  }, [
    isLoadingGlobalSettings,
    isLoadingProfile,
    isLoadingChangePassword,
    isLoadingPasswordResetRequired,
  ]);

  return (
    <Box>
      {isPasswordUpdated ? (
        <PasswordUpdated onBackToLogin={handleBackToLogin} loading={isLoggingOut} />
      ) : (
        <>
          <Typography variant="body1" mb={2}>
            Your password is valid for {passwordExpiredValue || '6'} months. You need to change your
            password before gaining access our application.
          </Typography>

          <Form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  label="Username"
                  autoComplete="asdasdasdasd"
                  value={mainProfile?.username || 'Unknown'}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <InputPassword
                  label="Current Password"
                  required
                  autoComplete="current-password"
                  placeholder="Current Password"
                  errorMessage={getErrorMessage(CHANGE_PASSWORD_KEY.CURRENT_PASSWORD)}
                  {...getFieldProps(CHANGE_PASSWORD_KEY.CURRENT_PASSWORD)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputPassword
                  label="New Password"
                  required
                  autoComplete="new-password"
                  placeholder="New Password"
                  errorMessage={getErrorMessage(CHANGE_PASSWORD_KEY.NEW_PASSWORD)}
                  {...getFieldProps(CHANGE_PASSWORD_KEY.NEW_PASSWORD)}
                />
                {values.newPassword && (
                  <ValidatePassword className="" password={values.newPassword} />
                )}
              </Grid>
              <Grid item xs={12}>
                <InputPassword
                  label="Confirm Password"
                  required
                  autoComplete="confirm-password"
                  placeholder="Confirm Password"
                  errorMessage={getErrorMessage(CHANGE_PASSWORD_KEY.CONFIRM_PASSWORD)}
                  {...getFieldProps(CHANGE_PASSWORD_KEY.CONFIRM_PASSWORD)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" isLoading={loading} isFull className="mb-8">
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  isLoading={loading}
                  className="mt-16"
                  isFull
                  onClick={() => {
                    handleBackToLogin();
                  }}
                >
                  Back to Login
                </Button>
              </Grid>
            </Grid>
          </Form>
        </>
      )}
    </Box>
  );
};

type Props = {};

export default ChangePasswordExpired;
