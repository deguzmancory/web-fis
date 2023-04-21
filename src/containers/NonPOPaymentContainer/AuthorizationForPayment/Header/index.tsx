import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box>
      <Typography mt={2} variant="body2" textAlign={'center'}>
        Research Corporation of the University of Hawaii
      </Typography>
      <Typography variant="h2" textAlign={'center'} mt={1}>
        Authorization for Payment Form
      </Typography>
    </Box>
  );
};

export default Header;
