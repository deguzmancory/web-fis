import { Box, Container } from '@mui/material';
import { Location } from 'history';
import React, { Suspense, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { LoadingCommon } from 'src/components/common';
import { setIsImmutableFormData } from 'src/redux/form/formSlice';
import { getLocationState } from 'src/utils';
import BreadcrumbsVendorRegistration from './breadcrumbs';
import { VENDOR_REGISTRATION_NAVIGATE_FROM, VENDOR_REGISTRATION_PARAMS } from './enums';
import NewVendorCheckList from './NewVendorChecklist';
import { VendorRegistrationRouteState } from './types';

const CreateVendorRegistration = React.lazy(() => import('./CreateVendorRegistration'));

const VendorRegistrationContainer: React.FC<Props> = ({ location }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const pageLocation = useLocation();
  const query = React.useMemo(() => new URLSearchParams(pageLocation.search), [pageLocation]);
  const [isFromForm, setIsFromForm] = React.useState<VENDOR_REGISTRATION_NAVIGATE_FROM>(null);
  const [currentPage, setCurrentPage] = React.useState(
    <NewVendorCheckList onNextPage={handleChangePage} /> // default will go to NewVendorCheckList
  );
  const vendorRegistrationId = query.get(VENDOR_REGISTRATION_PARAMS.VENDOR_REGISTRATION_ID) || null;
  function handleChangePage() {
    return setCurrentPage(<CreateVendorRegistration />);
  }

  useLayoutEffect(() => {
    const state: VendorRegistrationRouteState = getLocationState(location);

    // get section that navigate from
    if (state?.isFromForm) {
      setIsFromForm(state?.isFromForm);
    }

    // view only mode will directly go to main form
    if (state?.isViewOnly) {
      setCurrentPage(<CreateVendorRegistration isViewOnly={true} />);
      return;
    }

    if (vendorRegistrationId) {
      setCurrentPage(<CreateVendorRegistration />);
    }
  }, [location, vendorRegistrationId]);

  // in case user click back button in browser, it will keep the current form data of navigated section
  React.useEffect(() => {
    return history.listen(() => {
      if (history.action === 'POP') {
        if (
          [
            VENDOR_REGISTRATION_NAVIGATE_FROM.PO,
            VENDOR_REGISTRATION_NAVIGATE_FROM.NON_EMPLOYEE_TRAVEL_PAYMENT,
          ].includes(isFromForm)
        )
          dispatch(setIsImmutableFormData(true));
      }
    });
  }, [dispatch, history, isFromForm]);

  return (
    <Box py={4} minHeight={'50vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsVendorRegistration isFrom={isFromForm} />
        <Suspense fallback={<LoadingCommon />}>{currentPage}</Suspense>
      </Container>
    </Box>
  );
};

type Props = { location: Location<string> };

export default VendorRegistrationContainer;
