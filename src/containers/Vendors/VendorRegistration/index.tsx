import { Box, Container } from '@mui/material';
import { Location } from 'history';
import React, { Suspense, useLayoutEffect } from 'react';
import { LoadingCommon } from 'src/components/common';
import { getLocationState } from 'src/utils';
import BreadcrumbsVendorRegistration from './breadcrumbs';
import NewVendorCheckList from './NewVendorChecklist';

const CreateVendorRegistration = React.lazy(() => import('./CreateVendorRegistration'));

const VendorRegistrationContainer: React.FC<Props> = ({ location }) => {
  const [isFromForm, setIsFromForm] = React.useState(null);

  const handleChangePage = () => {
    return setCurrentPage(<CreateVendorRegistration />);
  };

  const [currentPage, setCurrentPage] = React.useState(
    <NewVendorCheckList onNextPage={handleChangePage} />
  );

  useLayoutEffect(() => {
    const state = getLocationState(location);
    if (state?.isFromForm) {
      setIsFromForm(state?.isFromForm);
    }
    if (state?.isViewOnly) {
      setCurrentPage(<CreateVendorRegistration isViewOnly={true} />);
    }
  }, [location]);

  return (
    <Box py={2} minHeight={'50vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsVendorRegistration isFrom={isFromForm} />
        <Suspense fallback={<LoadingCommon />}>{currentPage}</Suspense>
      </Container>
    </Box>
  );
};

type Props = { location: Location<string> };

export default VendorRegistrationContainer;
