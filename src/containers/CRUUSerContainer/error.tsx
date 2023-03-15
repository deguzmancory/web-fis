import { Box, Container } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUser } from 'src/queries/Users';
import { handleShowErrorMsg } from 'src/utils';
import BreadcrumbsUserDetail from './breadcrumbs';
import SectionLayout from '../shared/SectionLayout';
import { Callback } from 'src/redux/types';
const RefetchUser = React.lazy(() => import('./refetchUser'));

const ErrorWrapperCRUUser: React.FC<Props> = ({ resetErrorBoundary }) => {
  const { userId } = useParams<{ userId: string }>();

  const { onGetUserById, isLoading: isLoadingGetUser } = useGetUser({
    userId: userId || null,
    onSuccess: () => {
      resetErrorBoundary();
    },
    onError(err) {
      handleShowErrorMsg(err);
    },
  });

  return (
    <Box py={4}>
      <Container>
        <BreadcrumbsUserDetail isViewMode={!!userId} />
        <SectionLayout>
          <RefetchUser onGetUserById={onGetUserById} isLoading={isLoadingGetUser} />
        </SectionLayout>
      </Container>
    </Box>
  );
};

type Props = {
  resetErrorBoundary: Callback;
};

export default ErrorWrapperCRUUser;
