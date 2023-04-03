import { Box, Container } from '@mui/material';
import React, { Suspense } from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { LoadingCommon } from 'src/components/common';
import { PermissionsService } from 'src/services';
import BreadcrumbsVendorsListing from './breadcrumbs';

const NoPermission = React.lazy(() => import('src/components/NoPermission'));
const TableList = React.lazy(() => import('./TableList'));

const VendorsManagement = () => {
  const havePermission = PermissionsService.vendor().canView;
  return (
    <Box py={2} minHeight={'50vh'}>
      <Container maxWidth="xl">
        <BreadcrumbsVendorsListing />

        <Box
          px={4}
          pt={2}
          pb={1}
          mt={2}
          bgcolor={'white'}
          border={COLOR_CODE.DEFAULT_BORDER}
          borderRadius={1}
        >
          <Suspense fallback={<LoadingCommon />}>
            {havePermission ? <TableList /> : <NoPermission />}
          </Suspense>
        </Box>
      </Container>
    </Box>
  );
};

export default VendorsManagement;
