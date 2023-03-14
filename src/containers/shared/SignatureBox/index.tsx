import React from 'react';
import { Box, BoxProps, Divider, Grid, Typography } from '@mui/material';

const SignatureBox: React.FC<Props> = ({ ...props }) => {
  return (
    <Box pt={12} {...props}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Divider />
        </Grid>
        <Grid item xs={5}>
          <Divider />
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body2">Signature</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="body2">Date</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = BoxProps & {};

export default React.memo(SignatureBox);
