/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Hub } from 'aws-amplify';
import { History } from 'history';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { useComponentDidMount } from 'src/hooks';
import { MyProfile, useLogout, useProfile, useUpdateCurrentRoleProfile } from 'src/queries';
import { setAuthenticated, setProfile } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, Toastify, TokenService } from 'src/services';

const AuthContainer: React.FC<Props> = ({
  history,
  isAuthenticated,
  onSetAuth,
  onSetProfile,
  isWelcomeScreen,
}) => {
  const { logout } = useLogout();

  const handleSetAuthenticated = (data: MyProfile) => {
    onSetProfile(data);
    onSetAuth(true);
  };

  const handleLogout = () => {
    logout();
    TokenService.clearToken();
  };

  const { getMyProfile, handleInvalidateProfile } = useProfile({
    onSuccess(data) {
      if (data) {
        if (data.defaultUserType === data.currentRole) {
          handleSetAuthenticated(data);
        } else {
          updateCurrentRoleMyProfile({ roleName: data.defaultUserType });
        }
      }
    },
    onError(error) {
      if (error['message'].includes('User is not active')) {
        Toastify.error(
          'Your account is deactivated. Please contact to your administrator to reactivate your account.'
        );
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } else {
        Toastify.error(
          `Error when fetch profile data: ${JSON.stringify(
            error.message
          )} Please try to login again!`
        );
        setTimeout(() => {
          handleLogout();
        }, 3000);
      }
    },
  });

  const { updateCurrentRoleMyProfile } = useUpdateCurrentRoleProfile({
    onSuccess(data, variables, context) {
      handleInvalidateProfile();
      getMyProfile();
    },
  });

  useEffect(() => {
    Hub.listen('auth', authLogin);
    return () => {
      Hub.remove('auth', authLogin);
    };
  }, [isAuthenticated]);

  useComponentDidMount(async () => {
    try {
      await TokenService.getToken();
      authenticate();
    } catch (error) {
      clearAuth();
    }
  });

  const authLogin = (res: { payload: { event: string; data?: any } }) => {
    const { payload } = res;
    const { event } = payload;
    switch (event) {
      case 'signIn':
        authenticate();
        break;
      case 'signOut':
        TokenService.clearToken();
        clearAuth();
        break;
      case 'signIn_failure':
        console.log('signin error', payload?.data?.message);
        break;
      default:
        break;
    }
  };

  const clearAuth = () => {
    onSetAuth(false);
    Navigator.jumpToWebIdentity(PATHS.signIn);
  };

  const authenticate = () => {
    if (!isAuthenticated) {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          getMyProfile();
        })
        .catch(() => {
          clearAuth();
        });
    }
  };

  return null;
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { history: History };

const mapStateToProps = (state: IRootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isWelcomeScreen: state.auth.isWelcomeScreen,
});

const mapDispatchToProps = {
  onSetAuth: setAuthenticated,
  onSetProfile: setProfile,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthContainer));
