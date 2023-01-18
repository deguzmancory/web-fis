import { AppBar, Box, Link as MuiLink, Stack, Toolbar } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IMAGES } from 'src/appConfig/images';
import { PATHS } from 'src/appConfig/paths';
import { useProfile } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import { Image } from '../common';
import Header from './header';
import { navbarMenuItems } from './helpers';
import './styles.scss';
import UserMenu from './UserMenu';
const clsPrefix = 'ctn-navbar-desktop';

const Navbar: React.FC<Props> = () => {
  const { showNavbar } = useSelector((state: IRootState) => state.common);
  const { profile } = useProfile();
  const { fullName } = profile || {};

  if (!showNavbar) return null;

  return (
    <AppBar variant="elevation" position="fixed">
      <Header />

      <Toolbar variant="regular">
        <Stack width={'100%'} height={70} flexDirection={'row'} justifyContent={'space-between'}>
          <Box sx={{ transform: 'translateY(15px)' }}>
            <Link to={PATHS.root}>
              <Image src={IMAGES.logoFull} />
            </Link>
          </Box>
          {/* Main Menu Navbar */}
          <Stack flexDirection={'row'}>
            {navbarMenuItems.map((item) => (
              <Box
                className={`${clsPrefix}-item`}
                sx={{
                  cursor: 'pointer',
                }}
                key={item.label}
                my={'auto'}
              >
                <MuiLink
                  {...(item?.url && {
                    href: item.url,
                    // target: '_blank',
                    // rel: NO_OPENER,
                  })}
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  className={`${clsPrefix}-link`}
                  underline="none"
                >
                  {item.label}
                </MuiLink>
                <Box
                  className={cn(`${clsPrefix}-item__sub subItems`, {
                    isLeft: item?.isDisplayLeft,
                  })}
                >
                  {[
                    item.subItems.map((subItem) => (
                      <Box className={`subItem`} key={subItem.label}>
                        <MuiLink
                          {...(subItem?.url && {
                            href: subItem.url,
                            // target: '_blank',
                            // rel: NO_OPENER,
                          })}
                          underline="none"
                        >
                          {subItem.label}
                        </MuiLink>
                      </Box>
                    )),
                  ]}
                </Box>
              </Box>
            ))}
          </Stack>
          <Box sx={{ transform: 'translateY(7px)' }}>
            <UserMenu fullName={fullName} />
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

type Props = {};

export default Navbar;
