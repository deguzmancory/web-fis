import { Box } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

const Layout = ({ children }) => {
  return (
    <Box p={3} mt={2} bgcolor={'white'} border={COLOR_CODE.DEFAULT_BORDER}>
      {children}
    </Box>
  );
};

export default Layout;
