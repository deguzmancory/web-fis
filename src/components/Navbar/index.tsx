import {
  AppBar,
  Backdrop,
  Box,
  Link as MuiLink,
  CircularProgress,
  Stack,
  Toolbar,
} from '@mui/material';
import cn from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NO_OPENER } from 'src/appConfig/constants';
import { IMAGES } from 'src/appConfig/images';
import { PATHS } from 'src/appConfig/paths';
import { useProfile } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import { Image } from '../common';
import Header from './header';
import { navbarMenuItems } from './helpers';
import './styles.scss';
import UserMenu from './userMenu';

const clsPrefix = 'ctn-navbar-desktop';

const Navbar: React.FC<Props> = () => {
  const { showNavbar } = useSelector((state: IRootState) => state.common);
  const { profile } = useProfile();
  const { fullName } = profile || {};
  const [isClickedLogout] = React.useState(false);

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

      {/* <Toolbar variant="regular"> */}
      <Stack width={'100%'} height={70} flexDirection={'row'}>
        <Box sx={{ transform: 'translateY(15px)' }}>
          <Link to={PATHS.root}>
            <Image src={IMAGES.logoFull} />
          </Link>
        </Box>
        {/* Main Menu Navbar */}
        <Stack flexDirection={'row'}>
          {navbarMenuItems.map((item) => (
            <MuiLink
              {...(item?.url && {
                href: item.url,
                target: '_blank',
                rel: NO_OPENER,
              })}
              className={`${clsPrefix}-item ${clsPrefix}-link`}
              underline="none"
            >
              {item.label}
              <Box
                className={cn(`${clsPrefix}-item__sub subItems`, {
                  isLeft: item?.isDisplayLeft,
                })}
              >
                {[
                  item.subItems.map((subItem) => (
                    <Box className={`subItem`}>
                      <MuiLink
                        {...(subItem?.url && {
                          href: subItem.url,
                          target: '_blank',
                          rel: NO_OPENER,
                        })}
                        underline="none"
                      >
                        {subItem.label}
                      </MuiLink>
                    </Box>
                  )),
                ]}
              </Box>
            </MuiLink>
          ))}
        </Stack>
        <Box>
          <UserMenu fullName={fullName} />
        </Box>
      </Stack>
      {/* </Toolbar> */}
    </AppBar>
  );
};

type Props = {};

export default Navbar;
