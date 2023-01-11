import { Box, Container } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { IRootState } from 'src/redux/rootReducer';
import BreadcrumbsUserManagement from './breadcrumbs';
import './styles.scss';
import TableList from './TableList';

const UsersManagementContainers: React.FC<Props> = () => {
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
          <TableList />
        </Box>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UsersManagementContainers);
