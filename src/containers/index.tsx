import { Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteProps, Switch, useHistory } from 'react-router-dom';

import { PATHS } from 'src/appConfig/paths';
import Navbar from 'src/components/Navbar';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, TenantService } from 'src/services';
import Dev from './Dev';

import AuthContainer from './StartupContainers/AuthContainer';
import ContentContainer from './StartupContainers/ContentContainer';
import DialogContainer from './StartupContainers/DialogContainer';
import NotFound from './StartupContainers/NotFound';
import SplashScreen from './StartupContainers/SplashScreen';
import ToastContainer from './StartupContainers/ToastContainer';

import { Box } from '@mui/material';
import Footer from 'src/components/Footer';
import { useComponentDidMount } from 'src/hooks';
import ScrollToTop from './StartupContainers/ScrollToTop';

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

        <Route path={PATHS.dev} component={Dev} />
        <CustomRoute path={PATHS.dev} component={Dev} />
        <Route component={NotFound} />
      </Switch>

      <Footer />

      <AuthContainer />

      <ContentContainer />
      <DialogContainer />
      <ToastContainer />
      <ScrollToTop />
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

    const redirectPath = isAuthenticated ? PATHS.dashboard : PATHS.dashboard;
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
