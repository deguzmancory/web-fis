import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { IRootState } from 'src/redux/rootReducer';
import './styles.scss';

const SwitchUser: React.FC<Props> = () => {
  return (
    <Box py={2} minHeight={'50vh'}>
      <Container maxWidth="lg">
        <Typography variant="h2">Switch User Account</Typography>

        <Box
          mt={2}
          p={4}
          bgcolor={COLOR_CODE.WHITE}
          border={COLOR_CODE.DEFAULT_BORDER}
          borderRadius={'4px'}
        >
          <Typography variant="h3">Switch User</Typography>
        </Box>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchUser);
