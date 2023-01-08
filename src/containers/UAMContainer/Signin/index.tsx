/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { History } from 'history';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { Button, Form, Input, InputPassword } from 'src/components/common';
import { SignInPayload, useLogin, useProfile, useResendSignUp } from 'src/queries';
import { useUserId } from 'src/queries/UAM/useUserId';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/rootReducer';
import { ErrorService, Navigator } from 'src/services';
import { UAMBody } from '../common';
import EmailConfirmationModal from '../common/EmailConfirmationModal';
import MFAConfirmationModal from '../common/MFAConfirmationModal';
import { initialSignInFormValue, signInFormSchema, SignInFormValue, SIGNIN_KEY } from './helpers';

const Signin: React.FC<Props> = ({ onShowDialog, onHideDialog }) => {
  const formRef = useRef<FormikProps<SignInFormValue>>(null);

  const { login, isSigning } = useLogin({
    onSuccess(data, variables, context) {
      if (data.challengeName === 'CUSTOM_CHALLENGE')
        onShowDialog({
          type: DIALOG_TYPES.CONTENT_DIALOG,
          data: {
            content: <MFAConfirmationModal user={data} signInPayload={variables} />,
            hideTitle: true,
          },
        });
    },
    onError(error, variables, context) {
      handleError(error, variables);
    },
  });

  const { getUserId, isGettingUserId } = useUserId({
    onSuccess(data, variables, context) {
      login({ username: data.data.userId, password: variables.password });
    },
    onError(error, variables, context) {
      formRef.current.setErrors({
        username: '  ',
        password: ErrorService.MESSAGES.incorrectCredentials,
      });
    },
  });

  const { loading } = useProfile();

  const { resendSignUp } = useResendSignUp();

  const handleLogin = (values: SignInFormValue) => {
    const { username, password } = values;

    login({ username, password });
  };

  const handleConfirmSuccess = (payload: SignInPayload) => {
    onHideDialog();
    login(payload);
  };

  const handleError = (error: AuthError, variables: SignInPayload) => {
    switch (error.code) {
      case ErrorService.TYPES.NotAuthorizedException:
        // if (isIdle)
        return getUserId(variables);

      // return formRef.current.setErrors({
      //   email: ErrorService.MESSAGES.incorrectAccount,
      //   password: ErrorService.MESSAGES.incorrectAccount,
      // });

      case ErrorService.TYPES.UserNotFoundException:
        return formRef.current.setErrors({ username: ErrorService.MESSAGES.accountNotExist });

      case ErrorService.TYPES.UserNotConfirmedException:
        resendSignUp(
          { username: variables.username },
          {
            onSuccess(data) {
              onShowDialog({
                type: DIALOG_TYPES.CONTENT_DIALOG,
                data: {
                  content: (
                    <EmailConfirmationModal
                      username={variables.username}
                      onConfirmSuccess={() =>
                        handleConfirmSuccess({
                          username: variables.username,
                          password: variables.password,
                        })
                      }
                    />
                  ),
                  hideTitle: true,
                },
              });
            },
          }
        );
        return;
      case ErrorService.TYPES.UsernameExistsException:
        return;

      default:
        return ErrorService.handler(error);
    }
  };

  // =========================== FORGOT PASSWORD ===========================
  const handleForgotPassword = (data: SignInFormValue) => {
    Navigator.navigate(PATHS.forgotPassword, { email: data.username });
  };

  const { values, errors, touched, getFieldProps, handleSubmit } = useFormik({
    initialValues: initialSignInFormValue,
    onSubmit: handleLogin,
    validationSchema: signInFormSchema,
    innerRef: formRef,
  });

  const getErrorMessage = (fieldName: SIGNIN_KEY) => {
    // eslint-disable-next-line security/detect-object-injection
    return touched[fieldName] && errors[fieldName] ? errors.username : '';
  };

  return (
    <UAMBody>
      <Form onSubmit={handleSubmit} autoComplete="off" className="ctn-uam__form">
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
            <InputPassword
              label="Password"
              required
              placeholder="Password"
              errorMessage={getErrorMessage(SIGNIN_KEY.PASSWORD)}
              {...getFieldProps(SIGNIN_KEY.PASSWORD)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="default"
              className=""
              isFull
              isLoading={isSigning || loading || isGettingUserId}
            >
              Log In
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Stack flexDirection={'row'} justifyContent={'center'}>
              <Button variant="link" onClick={() => handleForgotPassword(values)}>
                Forgot Password?
              </Button>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'center'} mt={2}>
              <Typography variant="body2" className="mr-1">
                Don't have an account?
              </Typography>
              <Link to={PATHS.signUp}>
                <Typography variant="body2" fontWeight="bold" color={COLOR_CODE.INFO}>
                  Learn more
                </Typography>
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </UAMBody>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { history: History };

const mapStateToProps = (state: IRootState) => ({
  // isSigningIn: state.auth.is,
  // error: state.auth.error,
});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
