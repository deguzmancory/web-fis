import { Box, Grid } from '@mui/material';
import React from 'react';
import { Input } from 'src/components/common';

const EditVendorMaster: React.FC<Props> = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Input label="Vendor Name" />
        </Grid>
        <Grid item xs={4}>
          <Input label="Vendor Code" />
        </Grid>
        <Grid item xs={8}>
          <Input label="Vendor Address" />
        </Grid>
        <Grid item xs={4}>
          <Input label="Purge Flag" />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {};

export default EditVendorMaster;
