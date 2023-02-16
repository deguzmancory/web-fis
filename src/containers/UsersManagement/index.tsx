import { Box, Container } from '@mui/material';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { LoadingCommon } from 'src/components/common';
import { isCU } from 'src/queries/Profile/helpers';
import { IRootState } from 'src/redux/rootReducer';
import BreadcrumbsUserManagement from './breadcrumbs';
import './styles.scss';

const NoPermission = React.lazy(() => import('src/components/NoPermission'));
const TableList = React.lazy(() => import('./TableList'));

const UsersManagementContainers: React.FC<Props> = ({ currentRole }) => {
  return (
    <Box py={2} minHeight={'50vh'}>
      <Container maxWidth="lg">
        <BreadcrumbsUserManagement />

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
            {isCU(currentRole) ? <TableList /> : <NoPermission />}
          </Suspense>
        </Box>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({
  currentRole: state.auth.currentRole,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UsersManagementContainers);
