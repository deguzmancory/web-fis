import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';

import './styles.scss';

const GlobalSettings: React.FC<Props> = () => {
  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="lg">
        <Typography variant="h2">Global Settings</Typography>

        <Box my={2} p={4} bgcolor={COLOR_CODE.WHITE} border={COLOR_CODE.DEFAULT_BORDER}>
          <Typography variant="body1">aaaa</Typography>
        </Box>

        {/* <Accordion title={`Raw data delegation accesses`}>
          {receivedAccesses && <ReactJson src={receivedAccesses} />}
        </Accordion> */}
      </Container>
    </Box>
  );
};

type Props = {};

export default GlobalSettings;
