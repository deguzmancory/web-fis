import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Divider, Link as MuiLink, Stack, Typography, Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useSelector } from 'react-redux';
import { useLogout, useProfile } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import { TokenService } from 'src/services';
import { COLOR_CODE } from 'src/appConfig/constants';

export default function UserMenu({ fullName }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // Logout Function
  const { showNavbar } = useSelector((state: IRootState) => state.common);
  const { profile } = useProfile();
  const { roleName } = profile || {};
  const { logout } = useLogout();
  const [isClickedLogout, setIsClickedLogout] = React.useState(false);

  const handleLogout = () => {
    setIsClickedLogout(true);
    logout();
    TokenService.clearToken();
  };
  // Logout Function

  return (
    <Stack>
      <MuiLink
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Typography variant="body2" fontWeight={'bold'} sx={{ color: 'white', textAlign: 'right' }}>
          {fullName || 'Anonymous'}
          <ArrowDropDownIcon
            fontSize="small"
            sx={{
              transform: 'translateY(7px)',
            }}
          />
        </Typography>
      </MuiLink>

      <Box>
        <Typography variant="body2" fontWeight={'bold'} sx={{ color: COLOR_CODE.PRIMARY_500 }}>
          {roleName || 'Unknown'}
        </Typography>
        <Divider sx={{ background: COLOR_CODE.PRIMARY_500 }} />
      </Box>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ width: 162, height: 32 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper sx={{ background: COLOR_CODE.PRIMARY_800 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={handleClose} sx={{ color: 'white' }}>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ color: 'white' }}>
                    Switch User
                  </MenuItem>
                  <MenuItem onClick={() => handleLogout()} sx={{ color: 'white' }}>
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  );
}
