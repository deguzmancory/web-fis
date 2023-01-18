import { AppBar, Backdrop, Box, CircularProgress, Stack, Toolbar } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { IMAGES } from 'src/appConfig/images';
import { PATHS } from 'src/appConfig/paths';
import { useProfile } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import { Image } from '../common';
import Header from './header';
import MainMenu from './mainMenu';
import './styles.scss';
import UserMenu from './UserMenu';

const Navbar: React.FC<Props> = () => {
  const { showNavbar } = useSelector((state: IRootState) => state.common);
  const { profile } = useProfile();
  const { fullName, defaultUserType } = profile || {};
  const [isClickedLogout, setIsClickedLogout] = React.useState(false);

  if (!showNavbar) return null;

  return (
    <>
      {isClickedLogout && (
        <Backdrop sx={{ color: COLOR_CODE.WHITE, zIndex: 9999 }} open={true} onClick={() => {}}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <AppBar variant="elevation" position="fixed">
        <Header />

        <Toolbar variant="regular">
          <Stack width={'100%'} height={70} flexDirection={'row'} justifyContent={'space-between'}>
            <Box sx={{ transform: 'translateY(15px)' }}>
              <Link to={PATHS.root}>
                <Image src={IMAGES.logoFull} />
              </Link>
            </Box>

            <Stack flexDirection={'row'}>
              <MainMenu userRole={defaultUserType} />
            </Stack>

            <Box sx={{ transform: 'translateY(7px)' }}>
              <UserMenu fullName={fullName} setIsClickedLogout={setIsClickedLogout} />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

type Props = {};

export default Navbar;
