import { Box, Container } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUser } from 'src/queries/Users';
import { handleShowErrorMsg } from 'src/utils';
import BreadcrumbsUserDetail from './breadcrumbs';
import Layout from './layout';
const RefetchUser = React.lazy(() => import('./refetchUser'));

const ErrorWrapperCRUUser = () => {
  const { userId } = useParams<{ userId: string }>();

  const { onGetUserById, isLoading: isLoadingGetUser } = useGetUser({
    userId: userId || null,
    onError(err) {
      handleShowErrorMsg(err);
    },
  });
  return (
    <Box py={4}>
      <Container>
        <BreadcrumbsUserDetail isViewMode={!!userId} />
        <Layout>
          <RefetchUser onGetUserById={onGetUserById} isLoading={isLoadingGetUser} />
        </Layout>
      </Container>
    </Box>
  );
};

export default ErrorWrapperCRUUser;
