import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Button, IconSuccess } from 'src/components/common';
import { Callback } from 'src/redux/types';

const PasswordUpdated: React.FC<Props> = ({ onBackToLogin, loading = false }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Stack flexDirection={'row'} justifyContent={'center'} px={'auto'} alignItems={'center'}>
          <IconSuccess size={20} />
          <Typography variant="body1" textAlign={'center'} ml={1}>
            Your password is updated successfully.
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Button isFull isLoading={loading} onClick={() => onBackToLogin()}>
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

type Props = {
  onBackToLogin: Callback;
  loading?: boolean;
};

export default PasswordUpdated;
