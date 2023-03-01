import { AppBar, Backdrop, Box, CircularProgress, Stack, Toolbar } from '@mui/material';
import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { IMAGES } from 'src/appConfig/images';
import { PATHS } from 'src/appConfig/paths';
import { IRootState } from 'src/redux/rootReducer';
import { Image } from '../common';
import Header from './header';
import MainMenu from './mainMenu';
import './styles.scss';
import UserMenu from './UserMenu';

const clsPrefix = 'ctn-navbar-desktop';

const Navbar: React.FC<Props> = ({ userProfile, currentRole }) => {
  const { showNavbar } = useSelector((state: IRootState) => state.common);
  const { fullName } = userProfile || {};
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
                <Image src={IMAGES.logoFull} className={`${clsPrefix}-logo`} />
              </Link>
            </Box>

            <Stack flexDirection={'row'}>
              <MainMenu userRole={currentRole} />
            </Stack>

            <Box sx={{ transform: 'translateY(7px)' }}>
              <UserMenu
                fullName={fullName}
                currentRole={currentRole}
                setIsClickedLogout={setIsClickedLogout}
              />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> & {};

const mapStateToProps = (state: IRootState) => ({
  userProfile: state.auth.user,
  currentRole: state.auth.currentRole,
});

export default connect(mapStateToProps, undefined)(Navbar);
