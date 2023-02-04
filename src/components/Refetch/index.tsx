import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { Button } from 'src/components/common';
import { Callback } from 'src/redux/types';

const Refetch: React.FC<Props> = ({
  isLoading,
  onClick,
  title = 'Fail to fetch data, try to get data again',
  buttonTitle = 'Refetch',
}) => {
  return (
    <Stack flexDirection={'row'} justifyContent={'center'}>
      <Box>
        <Typography mb={1}>{title}</Typography>
        <Stack flexDirection={'row'} justifyContent={'center'}>
          <Button onClick={onClick} isLoading={isLoading} disabled={isLoading}>
            {buttonTitle}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

type Props = {
  isLoading: boolean;
  onClick: Callback;
  title?: string;
  buttonTitle?: string;
};

export default Refetch;
