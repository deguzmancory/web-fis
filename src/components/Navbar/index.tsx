import { AppBar, Backdrop, Box, CircularProgress, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IMAGES } from 'src/appConfig/images';
import { PATHS } from 'src/appConfig/paths';
import { useLogout, useProfile } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import { TokenService } from 'src/services';
import { Image } from '../common';
import Header from './header';
import './styles.scss';

// const clsPrefix = 'ctn-navbar-desktop';

const Navbar: React.FC<Props> = () => {
  const { showNavbar } = useSelector((state: IRootState) => state.common);
  const { profile } = useProfile();
  const { fullName, roleName } = profile || {};
  const { logout } = useLogout();
  const [isClickedLogout, setIsClickedLogout] = React.useState(false);

  const handleLogout = () => {
    setIsClickedLogout(true);
    logout();
    TokenService.clearToken();
  };

  if (!showNavbar) return null;
  return (
    <AppBar variant="elevation" position="fixed">
      {isClickedLogout && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          onClick={() => {}}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Header />

      <Toolbar variant="regular">
        <Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
          <Link to={PATHS.root}>
            <Image src={IMAGES.logoFull} />
          </Link>
          <Stack flexDirection={'row'}>
            <Box p={2}>
              <Typography variant="body2" fontWeight={'bold'} color="white">
                {fullName || 'Anonymous'}
              </Typography>
            </Box>
            <Box p={2}>
              <Typography variant="body2" fontWeight={'bold'} color="white">
                {roleName || 'Unknown'}
              </Typography>
            </Box>
            <Box
              p={2}
              onClick={() => {
                handleLogout();
              }}
              sx={{
                cursor: 'pointer',
              }}
            >
              <Typography variant="body2" fontWeight={'bold'} color="white">
                Logout
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

type Props = {};

export default Navbar;
