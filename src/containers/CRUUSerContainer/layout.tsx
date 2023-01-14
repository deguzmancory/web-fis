import { Box } from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';

const Layout = ({ children }) => {
  return (
    <Box p={3} mt={2} bgcolor={'white'} border={COLOR_CODE.DEFAULT_BORDER} borderRadius={1}>
      {children}
    </Box>
  );
};

export default Layout;
