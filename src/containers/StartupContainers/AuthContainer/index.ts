/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Hub } from 'aws-amplify';
import { History } from 'history';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { useComponentDidMount } from 'src/hooks';
import { MyProfile, useLogout, useMyPermissions, useProfile } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { setAuthenticated, setCurrentRole, setProfile } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/rootReducer';
import {
  DelegationKeyService,
  Navigator,
  PermissionsService,
  RoleService,
  Toastify,
  TokenService,
} from 'src/services';

const AuthContainer: React.FC<Props> = ({
  history,
  isAuthenticated,
  onSetAuth,
  onSetProfile,
  onSetCurrentRole,
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

  const { getMyPermissions } = useMyPermissions({
    onSuccess(data) {
      const permissions = data?.map((permission) => permission.displayName) || [];
      PermissionsService.setPermissions(permissions);
    },
    onError(error) {
      Toastify.error(
        `Error when fetch permission data: ${JSON.stringify(
          error.message
        )} Please try to login again!`
      );
      setTimeout(() => {
        handleLogout();
      }, 3000);
    },
  });

  const { getMyProfile } = useProfile({
    onSuccess(data) {
      if (data) {
        handleSetAuthenticated(data);

        const currentRoleLocalStorage = RoleService.getCurrentRole();
        let _currentRole = '';
        if (
          currentRoleLocalStorage &&
          data.roles.some((role) => role.role.name === currentRoleLocalStorage)
        ) {
          _currentRole = currentRoleLocalStorage;
        } else {
          RoleService.setCurrentRole(data.defaultUserType as ROLE_NAME);
          _currentRole = data.defaultUserType;
        }

        onSetCurrentRole(_currentRole as ROLE_NAME);

        if (data.roles.some((role) => role.role.name === ROLE_NAME.CU)) {
          getMyPermissions();
        }
      }
    },
    onError(error) {
      if (error?.['message'].includes('User is not active')) {
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

  window.addEventListener('beforeunload', (e) => {
    DelegationKeyService.clearDelegationKey();
  });

  return null;
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { history: History };

const mapStateToProps = (state: IRootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {
  onSetAuth: setAuthenticated,
  onSetProfile: setProfile,
  onSetCurrentRole: setCurrentRole,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthContainer));
