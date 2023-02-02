import { Box, Grid, Skeleton, Stack } from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';

const SkeletonDashboard = () => {
  return (
    <>
      <Box mb={2}>
        <Skeleton animation="wave" variant="text" height={32} width={644} />
      </Box>
      <Grid container spacing={2} alignItems="stretch">
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={4} key={index}>
            <Box
              minHeight={'100%'}
              py={4}
              px={3}
              bgcolor={COLOR_CODE.WHITE}
              border={COLOR_CODE.DEFAULT_BORDER}
            >
              <Box>
                <Stack flexDirection={'row'} justifyContent={'center'}>
                  <Skeleton animation="wave" variant="circular" width={75} height={75} />
                </Stack>
                <Stack flexDirection={'row'} justifyContent={'center'}>
                  <Skeleton animation="wave" variant="text" height={32} width={140} />
                </Stack>
                <Stack flexDirection={'row'} justifyContent={'center'}>
                  <Skeleton animation="wave" variant="text" height={20} width={140} />
                </Stack>
              </Box>
              <Box mt={2}>
                {Array.from({ length: 6 }).map((_, _index) => (
                  <Box key={_index} py={1} borderBottom={`1px solid ${COLOR_CODE.PRIMARY_100}`}>
                    <Skeleton animation="wave" variant="text" height={20} width={160} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SkeletonDashboard;
