import { Box, Container } from '@mui/material';
import React, { Suspense } from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { LoadingCommon } from 'src/components/common';
import BreadcrumbsNonPOListing from './breadcrumbs';

const TableList = React.lazy(() => import('./TableList'));

const NonPOListing = () => {
  return (
    <Box py={2} minHeight={'50vh'}>
      <Container maxWidth="xl">
        <BreadcrumbsNonPOListing />
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
            <TableList />
          </Suspense>
        </Box>
      </Container>
    </Box>
  );
};

export default NonPOListing;
