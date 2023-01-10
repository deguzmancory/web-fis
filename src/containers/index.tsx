import { Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteProps, Switch, useHistory } from 'react-router-dom';

import { PATHS } from 'src/appConfig/paths';
import Navbar from 'src/components/Navbar';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, TenantService } from 'src/services';
import Dev from './Dev';

import Sidebar from 'src/components/Sidebar';
import AuthContainer from './StartupContainers/AuthContainer';
import ContentContainer from './StartupContainers/ContentContainer';
import DialogContainer from './StartupContainers/DialogContainer';
import LoadingContainer from './StartupContainers/LoadingContainer';
import NotFound from './StartupContainers/NotFound';
import ResponsiveContainer from './StartupContainers/ResponsiveContainer';
import SplashScreen from './StartupContainers/SplashScreen';
import ToastContainer from './StartupContainers/ToastContainer';
import UploadProgressContainer from './StartupContainers/UploadProgressContainer';

import { Box } from '@mui/material';
import Footer from 'src/components/Footer';
import { useComponentDidMount } from 'src/hooks';
import ScrollToTop from './StartupContainers/ScrollToTop';

const Signin = React.lazy(() => import('./UAMContainer/Signin'));
const Signup = React.lazy(() => import('./UAMContainer/Signup'));
const ForgotPassword = React.lazy(() => import('./UAMContainer/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./UAMContainer/ResetPassword'));
const Welcome = React.lazy(() => import('./UAMContainer/Welcome'));
const Dashboard = React.lazy(() => import('./Dashboard'));

const Routing: React.FC<{ location: Location }> = (props) => {
  Navigator.setTopHistory(useHistory());

  useComponentDidMount(() => {
    const currentWebTenant = TenantService.getWebTenant();
    TenantService.setTenant({ name: currentWebTenant });
  });

  return (
    <Box pt={12}>
      <Navbar />
      <Switch location={props.location}>
        <Route path={PATHS.root} render={() => <Redirect to={PATHS.dashboard} />} exact />
        <CustomRoute pageRequiredAuth path={PATHS.dashboard} component={Dashboard} />

        <CustomRoute path={PATHS.signIn} component={Signin} />
        <CustomRoute path={PATHS.signUp} component={Signup} />

        <CustomRoute path={PATHS.forgotPassword} component={ForgotPassword} />
        <CustomRoute path={PATHS.resetPassword} component={ResetPassword} />
        <CustomRoute path={PATHS.welcome} component={Welcome} />

        <Route path={PATHS.dev} component={Dev} />
        <CustomRoute path={PATHS.dev} component={Dev} />
        <Route component={NotFound} />
      </Switch>

      <Sidebar />
      <Footer />

      <ScrollToTop />
      <AuthContainer />
      <ContentContainer />
      <LoadingContainer />
      <DialogContainer />
      <ToastContainer />
      <ResponsiveContainer />
      <UploadProgressContainer />
    </Box>
  );
};

export default Routing;

const CRouting: React.FC<Props> = ({ isAuthenticated, pageRequiredAuth, component, ...rest }) => {
  const renderRoute = (Component: any) => (props: RouteProps) => {
    if (isAuthenticated === null) return <SplashScreen />;

    if ((isAuthenticated && pageRequiredAuth) || (!isAuthenticated && !pageRequiredAuth)) {
      // Before render component, check permission first
      return <Component {...props} />;
    }

    const redirectPath = isAuthenticated ? PATHS.myProfile : PATHS.signIn;
    const redirectProps = {
      to: {
        pathname: redirectPath,
        state: { from: props.location },
      },
    };
    return <Redirect {...redirectProps} />;
  };

  return <Route {...rest} render={renderRoute(component)} />;
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  RouteProps & { pageRequiredAuth?: boolean };

const mapStateToProps = (state: IRootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {};

const CustomRoute = connect(mapStateToProps, mapDispatchToProps)(CRouting);
