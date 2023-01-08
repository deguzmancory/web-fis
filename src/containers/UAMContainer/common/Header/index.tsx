import { Stack, Typography } from '@mui/material';

const Header = () => {
  return (
    <Stack justifyContent={'center'} alignItems="center" flexDirection={'column'} mb={4}>
      <Typography variant="body1" mb={1}>
        The Research Corporation of the University of Hawaii
      </Typography>
      <Typography variant="h2">Financial System Login</Typography>
    </Stack>
  );
};

export default Header;
