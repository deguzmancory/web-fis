import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
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
      </Stack>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
