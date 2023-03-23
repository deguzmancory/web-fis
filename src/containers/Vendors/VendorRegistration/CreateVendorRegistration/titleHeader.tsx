import { Box, Typography } from '@mui/material';
import React from 'react';

const CreateVendorRegistrationTitle = () => {
  return (
    <Box>
      <Typography variant="h2" mt={2} mb={1}>
        Vendor Registration
      </Typography>
      <Typography variant="body2">
        FOR U.S. CITIZENS & U.S.{' '}
        <span style={{ textDecoration: 'underline' }}>
          ENTITIES ONLY. DO NOT USE THIS FORM FOR NON-U.S. VENDOR.
        </span>
      </Typography>
    </Box>
  );
};

export default React.memo(CreateVendorRegistrationTitle);
