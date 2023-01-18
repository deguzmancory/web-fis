import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { IRootState } from 'src/redux/rootReducer';
import './styles.scss';

const Dashboard: React.FC<Props> = () => {
  return (
    <Box minHeight={'70vh'}>
      <Stack height="100%" justifyContent={'center'} alignItems={'center'}>
        <Typography variant="h3">
          Welcome to © {new Date().getFullYear()}{' '}
          <b className="has-text-primary">The Research Corporation of the University of Hawaii</b>
        </Typography>
        <Box p={4}>
          <Link to={PATHS.userManagements}>
            <TypographyLink variant="h1">User Management</TypographyLink>
          </Link>
          <Link to={PATHS.switchUser}>
            <TypographyLink variant="h1">Switch User</TypographyLink>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
