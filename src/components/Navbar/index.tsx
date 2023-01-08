import { AppBar, Toolbar } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IMAGES } from 'src/appConfig/images';
import { PATHS } from 'src/appConfig/paths';
import { IRootState } from 'src/redux/rootReducer';
import { Image } from '../common';

const Navbar: React.FC<Props> = () => {
  const { showNavbar } = useSelector((state: IRootState) => state.common);

  if (!showNavbar) return null;
  return (
    <AppBar variant="elevation" position="fixed">
      <Toolbar variant="regular">
        <Link
          to={PATHS.root}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <Image src={IMAGES.logoFull} />
        </Link>
      </Toolbar>
    </AppBar>
  );
};

type Props = {};

export default Navbar;
