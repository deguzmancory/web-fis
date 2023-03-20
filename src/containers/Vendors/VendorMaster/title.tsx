import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

const TitleVendorMaster = () => {
  return (
    <Stack direction={'row'} justifyContent="center">
      <Box>
        <Typography variant="body1" fontWeight={'bold'} mt={2} mb={1} textAlign="center">
          The Research Corporation of the University of Hawaii
        </Typography>
        <Typography variant="h2" textAlign="center">
          VENDOR RECORD
        </Typography>
      </Box>
    </Stack>
  );
};

export default React.memo(TitleVendorMaster);
