/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Hub } from 'aws-amplify';
import { History } from 'history';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { useComponentDidMount } from 'src/hooks';
import { MyProfile, useLogout, useProfile, useUpdateCurrentRoleProfile } from 'src/queries';
import { setAuthenticated, setIsUpdatedCurrentRole, setProfile } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/rootReducer';
import { DelegationKeyService, Navigator, Toastify, TokenService } from 'src/services';

const AuthContainer: React.FC<Props> = ({
  history,
  isAuthenticated,
  onSetAuth,
  onSetProfile,
  isUpdatedCurrentRole,
  onSetUpdatedCurrentRoleStatus,
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
        } else if (!isUpdatedCurrentRole) {
          updateCurrentRoleMyProfile({ roleName: data.defaultUserType });
        } else if (isUpdatedCurrentRole) {
          handleSetAuthenticated(data);
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
      onSetUpdatedCurrentRoleStatus(true);
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
    DelegationKeyService.clearDelegationKey();
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
  isUpdatedCurrentRole: state.auth.isUpdatedCurrentRole,
});

const mapDispatchToProps = {
  onSetAuth: setAuthenticated,
  onSetProfile: setProfile,
  onSetUpdatedCurrentRoleStatus: setIsUpdatedCurrentRole,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthContainer));
