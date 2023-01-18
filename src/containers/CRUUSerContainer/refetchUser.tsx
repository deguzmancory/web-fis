import { Box, Container, Stack } from '@mui/material';
import React from 'react';
import { Button } from 'src/components/common';
import { Callback } from 'src/redux/types';

const RefetchUser: React.FC<Props> = ({ isLoading, onGetUserById }) => {
  return (
    <Container maxWidth="sm">
      <Stack flexDirection={'row'} justifyContent={'center'}>
        <Box>
          <Button
            onClick={() => {
              onGetUserById();
            }}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Refetch User
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

type Props = {
  onGetUserById: Callback;
  isLoading: boolean;
};

export default RefetchUser;
