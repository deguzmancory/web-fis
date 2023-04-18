import { Box, Container, Stack } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'src/components/common';
import { useGetPODetail } from 'src/queries/PurchaseOrders';
import { Callback } from 'src/redux/types';
import { Toastify } from 'src/services';

const RefetchPO: React.FC<Props> = ({ resetErrorBoundary }) => {
  const { id } = useParams<{ id: string }>();

  const { onGetPOById, isLoading } = useGetPODetail({
    id: id,
    onSuccess: () => {
      resetErrorBoundary();
    },
    onError: (error) => {
      Toastify.error(error.message);
    },
  });

  return (
    <Container maxWidth="sm">
      <Stack flexDirection={'row'} justifyContent={'center'}>
        <Box>
          <Button
            onClick={() => {
              onGetPOById();
            }}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Refetch PO
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

type Props = {
  resetErrorBoundary: Callback;
};

export default RefetchPO;
