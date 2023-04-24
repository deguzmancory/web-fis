import { Location } from 'history';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteProps, Switch, useHistory } from 'react-router-dom';

import { PATHS } from 'src/appConfig/paths';
import Navbar from 'src/components/Navbar';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, TenantService } from 'src/services';
import Dev from './Dev';

import AuthContainer from './StartupContainers/AuthContainer';
import DialogContainer from './StartupContainers/DialogContainer';
import LightboxContainer from './StartupContainers/LightboxContainer';
import NotFound from './StartupContainers/NotFound';
import SplashScreen from './StartupContainers/SplashScreen';
import ToastContainer from './StartupContainers/ToastContainer';

import { Box } from '@mui/material';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import Footer from 'src/components/Footer';
import { useComponentDidMount } from 'src/hooks';
import ContentContainer from './StartupContainers/ContentContainer';
import LoadingContainer from './StartupContainers/LoadingContainer';
import ScrollToTop from './StartupContainers/ScrollToTop';
import CheckPasswordExpiredContainer from './UAMContainer/ChangePasswordExpired/container';

const Dashboard = React.lazy(() => import('./Dashboard'));
const UsersManagement = React.lazy(() => import('./UsersManagement'));
const CRUUSerContainer = React.lazy(() => import('./CRUUSerContainer'));
const SwitchUser = React.lazy(() => import('./SwitchUser'));
const GlobalSettings = React.lazy(() => import('./GlobalSettings'));
const EditProfile = React.lazy(() => import('./EditProfile'));
const EmptyScreen = React.lazy(() => import('./UAMContainer/ChangePasswordExpired/emptyScreen'));
const PurchaseOrder = React.lazy(() => import('./PurchaseOrderContainer/PO'));
const AdditionalPOFormsContainer = React.lazy(() => import('./AdditionalPOForms'));
const VendorsManagement = React.lazy(() => import('./VendorsManagement'));
const EditVendorsMaster = React.lazy(() => import('./Vendors/VendorMaster'));
const VendorRegistration = React.lazy(() => import('./Vendors/VendorRegistration'));
const SubmittedPurchaseOrder = React.lazy(() => import('./PurchaseOrderContainer/PO/SubmittedPO'));
const POListing = React.lazy(() => import('./POListing'));
const SelectChangeFormType = React.lazy(
  () => import('./PurchaseOrderContainer/POChange/SelectChangeFormType')
);
const POChangeForm = React.lazy(() => import('./PurchaseOrderContainer/POChange/POChangeForm'));
const POPayment = React.lazy(() => import('./PurchaseOrderContainer/POPayment'));
const VendorPrintMode = React.lazy(() => import('./PurchaseOrderContainer/PO/VendorPrintMode'));
const SelectNonPOPaymentType = React.lazy(
  () => import('./NonPOPaymentContainer/SelectNonPOPaymentType')
);
const AuthorizationForPayment = React.lazy(
  () => import('./NonPOPaymentContainer/AuthorizationForPayment')
);
const NonEmployeeExpensePayment = React.lazy(
  () => import('./NonPOPaymentContainer/NonEmployeeExpensePayment')
);
const PersonalAutomobileMileageVoucher = React.lazy(
  () => import('./NonPOPaymentContainer/PersonalAutomobileMileageVoucher')
);
const PettyCashSummarySheet = React.lazy(
  () => import('./NonPOPaymentContainer/PettyCashSummarySheet')
);
const NonPOListing = React.lazy(() => import('./NonPOListing'));
const SubmittedNonPO = React.lazy(() => import('./NonPOPaymentContainer/shared/SubmittedNonPO'));

const Routing: React.FC<{ location: Location }> = (props) => {
  Navigator.setTopHistory(useHistory());

  useComponentDidMount(() => {
    const currentWebTenant = TenantService.getWebTenant();
    TenantService.setTenant({ name: currentWebTenant });
  });

  return (
    <Box pt={13}>
      <Navbar />
      <Box mb={3}>
        <Suspense fallback={<LoadingContainer />}>
          <Switch location={props.location}>
            <Route path={PATHS.root} render={() => <Redirect to={PATHS.dashboard} />} exact />
            <CustomRoute pageRequiredAuth path={PATHS.dashboard} component={Dashboard} />

            {/* Users */}
            <CustomRoute pageRequiredAuth path={PATHS.addUser} component={CRUUSerContainer} exact />

            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.userDetail}/:userId`}
              component={CRUUSerContainer}
            />

            <CustomRoute
              pageRequiredAuth
              path={PATHS.userManagements}
              component={UsersManagement}
            />

            {/* PO */}
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.purchaseOrderDetail}/:id`}
              component={PurchaseOrder}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.poAdditionalForm}/:formCode`}
              component={AdditionalPOFormsContainer}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.submittedPurchaseOrder}/:id`}
              component={SubmittedPurchaseOrder}
            />
            <CustomRoute
              pageRequiredAuth
              path={PATHS.createPurchaseOrders}
              component={PurchaseOrder}
            />

            {/* PO Change */}
            <CustomRoute
              pageRequiredAuth
              path={PATHS.poChangeOptions}
              component={SelectChangeFormType}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.poChangeForm}/:id`}
              component={POChangeForm}
            />

            {/* PO Payment */}
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.poPaymentForm}/:id`}
              component={POPayment}
            />

            {/* Purchasing List*/}
            <CustomRoute pageRequiredAuth path={PATHS.purchasingOrders} component={POListing} />

            {/* Non PO Payment */}
            <CustomRoute
              pageRequiredAuth
              path={PATHS.nonPOPaymentOptions}
              component={SelectNonPOPaymentType}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.createAuthorizationForPayment}`}
              component={AuthorizationForPayment}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.authorizationForPaymentDetail}/:id`}
              component={AuthorizationForPayment}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.createNonEmployeeTravelPayment}`}
              component={NonEmployeeExpensePayment}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.nonEmployeeTravelPaymentDetail}/:id`}
              component={NonEmployeeExpensePayment}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.createPersonalAutoPayment}`}
              component={PersonalAutomobileMileageVoucher}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.personalAutoPaymentDetail}/:id`}
              component={PersonalAutomobileMileageVoucher}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.createPettyCashPayment}`}
              component={PettyCashSummarySheet}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.pettyCashPaymentDetail}/:id`}
              component={PettyCashSummarySheet}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.submittedNonPOPayment}/:id`}
              component={SubmittedNonPO}
            />

            {/* Purchasing List*/}
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.submittedNonPOPayment}/:id`}
              component={SubmittedNonPO}
            />

            {/* Non PO Listing*/}
            <CustomRoute pageRequiredAuth path={PATHS.nonPOListing} component={NonPOListing} />

            {/* Vendor Print Mode */}
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.vendorPrintMode}/:id`}
              component={VendorPrintMode}
            />

            {/* Vendors */}
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.addVendorRegistration}`}
              component={VendorRegistration}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.editVendorMaster}/:vendorCode`}
              component={EditVendorsMaster}
            />
            <CustomRoute
              pageRequiredAuth
              path={`${PATHS.addVendorMaster}`}
              component={EditVendorsMaster}
            />
            <CustomRoute pageRequiredAuth path={PATHS.vendors} component={VendorsManagement} />

            {/* Profile */}
            <CustomRoute pageRequiredAuth path={PATHS.switchUser} component={SwitchUser} />
            <CustomRoute pageRequiredAuth path={PATHS.myProfile} component={EditProfile} />

            {/* Global Settings */}
            <CustomRoute pageRequiredAuth path={PATHS.globalSettings} component={GlobalSettings} />
            <CustomRoute pageRequiredAuth path={PATHS.expiredPassword} component={EmptyScreen} />

            <Route path={PATHS.dev} component={Dev} />
            <CustomRoute path={PATHS.dev} component={Dev} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Box>

      <Footer />

      <AuthContainer />
      <ContentContainer />
      <DialogContainer />
      <LightboxContainer />
      <ToastContainer />
      <ScrollToTop />
      <CheckPasswordExpiredContainer />
    </Box>
  );
};

export default Routing;

const CRouting: React.FC<Props> = ({ isAuthenticated, pageRequiredAuth, component, ...rest }) => {
  const renderRoute = (Component: any) => (props: RouteProps) => {
    if (isAuthenticated === null) return <SplashScreen />;

    if ((isAuthenticated && pageRequiredAuth) || (!isAuthenticated && !pageRequiredAuth)) {
      // Before render component, check permission first
      return (
        <CustomErrorBoundary showErrorMessage>
          <Component {...props} />
        </CustomErrorBoundary>
      );
    }

    const redirectPath = isAuthenticated ? PATHS.dashboard : PATHS.dashboard;
    const redirectProps = {
      to: {
        pathname: redirectPath,
        state: { from: props.location },
      },
    };

    return (
      <CustomErrorBoundary fallback={<LoadingContainer />}>
        <Redirect {...redirectProps} />
      </CustomErrorBoundary>
    );
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
