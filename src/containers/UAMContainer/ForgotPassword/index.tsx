import { FormikProps, useFormik } from 'formik';
import { History, Location } from 'history';
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';

import { Button, Form, Input, LoadingCommon } from 'src/components/common';
import { IRootState } from 'src/redux/rootReducer';

import { PATHS } from 'src/appConfig/paths';
import { useComponentDidMount } from 'src/hooks';
import { ForgotPasswordPayload, useForgotPassword, useResendSignUp } from 'src/queries';
import { ErrorService, Navigator, Toastify } from 'src/services';
import { getLocationState } from 'src/utils';

import { Grid, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { UAMBody } from '../common';
import EmailConfirmationModal from '../common/EmailConfirmationModal';
import { SIGNIN_KEY } from '../Signin/helpers';
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormValue,
  initialForgotPasswordFormValue,
} from './helpers';

const ForgotPassword: React.FC<Props> = ({ location, onHideDialog, onShowDialog }) => {
  const formRef = useRef<FormikProps<ForgotPasswordFormValue>>(null);

  const [userNameSent, setUsernameSent] = useState('');
  const { resendSignUp } = useResendSignUp();

  useComponentDidMount(() => {
    const state = getLocationState(location);
    if (state?.username) {
      formRef.current.setValues({ username: state.username as string });
    }
  });

  const handleError = (error: AuthError, variables: ForgotPasswordPayload) => {
    switch (error.code) {
      case 'InvalidParameterException':
        resendSignUp({ username: variables.username });
        return onShowDialog({
          type: DIALOG_TYPES.CONTENT_DIALOG,
          data: {
            content: (
              <EmailConfirmationModal
                username={variables.username}
                onConfirmSuccess={() => {
                  onHideDialog();
                  Navigator.navigate(PATHS.signIn, { username: variables.username });
                }}
              />
            ),
            hideTitle: true,
          },
        });
      default:
        return ErrorService.handler(error);
    }
  };

  const { forgotPassword, isLoading } = useForgotPassword({
    onSuccess(data, variables, context) {
      setUsernameSent(variables.username);
      if (userNameSent) Toastify.success('A new link has been sent to your email.');
      // Navigator.navigate(PATHS.resetPassword, { email: variables.email });
    },
    onError(error, variables, context) {
      handleError(error, variables);
    },
  });

  // =========================== FORGOT PASSWORD ===========================
  const handleSubmitForgotPassword = (values: ForgotPasswordFormValue) => {
    const { username } = values;
    const preferredUsername = `${username}`;
    forgotPassword({ username: preferredUsername });
  };

  const handleResendEmail = () => {
    forgotPassword({ username: userNameSent });
  };

  const { errors, touched, getFieldProps, handleSubmit } = useFormik({
    initialValues: initialForgotPasswordFormValue,
    onSubmit: handleSubmitForgotPassword,
    validationSchema: forgotPasswordFormSchema,
    innerRef: formRef,
  });

  const getErrorMessage = (fieldName: SIGNIN_KEY) => {
    // eslint-disable-next-line security/detect-object-injection
    return touched[fieldName] && errors[fieldName] ? errors.username : '';
  };

  return (
    <UAMBody>
      <Box mb={1}>
        {userNameSent ? (
          <Typography variant="body1" textAlign={'center'}>
            {'Password has been successfully reset and a new password has been emailed to you. '}
          </Typography>
        ) : (
          <Typography variant="body1" textAlign={'center'}>
            {'Enter your Username and Submit to have a new password emailed to you:'}
          </Typography>
        )}
      </Box>

      {!userNameSent && (
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Input
                label="Username"
                required
                placeholder="Username"
                errorMessage={getErrorMessage(SIGNIN_KEY.USERNAME)}
                {...getFieldProps(SIGNIN_KEY.USERNAME)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" isLoading={isLoading} isFull>
                Continue
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}

      {userNameSent && (
        <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          <Typography
            variant="body2"
            className="mr-1"
            sx={{
              transform: 'translateY(-1px)',
            }}
          >
            Didn't receive an email?
          </Typography>
          {isLoading ? (
            <LoadingCommon />
          ) : (
            <Button variant="link" onClick={handleResendEmail}>
              Send again
            </Button>
          )}
        </Stack>
      )}

      <Stack flexDirection={'row'} justifyContent={'center'} my={2}>
        <Link to={PATHS.signIn}>
          <Button variant="link">Return to Login Page</Button>
        </Link>
      </Stack>

      <Stack flexDirection={'row'} justifyContent={'center'}>
        <Typography variant="body2" className="mr-1">
          Don't have an account?
        </Typography>
        <Link to={PATHS.signUp}>
          <Typography variant="body2" fontWeight="bold" color={COLOR_CODE.INFO}>
            Learn more
          </Typography>
        </Link>
      </Stack>
    </UAMBody>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & { history: History; location: Location<string> };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
