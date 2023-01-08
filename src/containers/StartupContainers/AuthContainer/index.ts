/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Hub } from 'aws-amplify';
import { History } from 'history';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { useComponentDidMount } from 'src/hooks';
import { MyProfile, useLogout, useProfile } from 'src/queries';
import { setAuthenticated, setUserName } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/rootReducer';
import { ErrorService, Navigator, TokenService } from 'src/services';

const AuthContainer: React.FC<Props> = ({
  history,
  isAuthenticated,
  onSetAuth,
  onSetUserName,
  isWelcomeScreen,
}) => {
  const { logout } = useLogout();

  const handleSetAuthenticated = (data: MyProfile) => {
    onSetUserName({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });

    onSetAuth(true);
  };

  // const { getMyPermissions } = useMyPermissions({
  //   onSuccess: async (data) => {
  //     onSetMyPermissions(data);
  //     const localPermissions = await PermissionsService.getPermissions();
  //     onSetMyPermissions(data);
  //     const isDiffPermissions =
  //       isEmpty(localPermissions) ||
  //       data.length !== localPermissions.length ||
  //       // eslint-disable-next-line security/detect-object-injection
  //       localPermissions.some((item, idx) => item !== data[idx]);
  //     if (isDiffPermissions) {
  //       const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();
  //       const refreshToken = cognitoUser.getSignInUserSession().getRefreshToken();
  //       return cognitoUser.refreshSession(refreshToken, () => {
  //         getMyProfile();
  //       });
  //     }
  //     return getMyProfile();
  //   },
  // });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getMyProfile } = useProfile({
    onSuccess(data) {
      if (data) {
        handleSetAuthenticated(data);
      }
    },
    onError(err) {
      ErrorService.handler(err);
      logout();
    },
  });

  useEffect(() => {
    Hub.listen('auth', authLogin);
    // 1.call this first when mount because history listen fire when route changed
    // authenticate();
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
      // 2. Get current user
      Auth.currentAuthenticatedUser()
        .then((user) => {
          // const userAttributes = user.attributes;
          // TODO: Temp fix until fis profile integrated
          // getMyPermissions();
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
  onSetUserName: setUserName,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthContainer));
