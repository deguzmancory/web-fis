import { Box, SxProps } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';

const Layout: React.FC<Props> = ({ sx, children }) => {
  return (
    <Box sx={sx} p={3} mt={2} bgcolor={'white'} border={COLOR_CODE.DEFAULT_BORDER}>
      {children}
    </Box>
  );
};

interface Props {
  sx?: SxProps;
  children?: React.ReactNode;
}

export default Layout;
