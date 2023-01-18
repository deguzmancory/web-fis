import * as React from 'react';
import { ClickAwayListener } from '@mui/material/';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Divider, Link as MuiLink, Stack, Typography, Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useLogout, useProfile } from 'src/queries';
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

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // Logout Function
  const { profile } = useProfile();
  const { roleName } = profile || {};
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
    TokenService.clearToken();
  };
  // Logout Function

  return (
    <Stack width={162} height={32}>
      <MuiLink
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onMouseOver={handleToggle}
        underline="none"
      >
        <Typography variant="inherit" sx={{ color: COLOR_CODE.WHITE, textAlign: 'right' }}>
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
        <Typography variant="body2" sx={{ color: COLOR_CODE.PRIMARY_500, textAlign: 'center' }}>
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
        sx={{ width: 'inherit', height: 'inherit' }}
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
                <MenuList autoFocusItem={open}>
                  <MenuItem onClick={handleClose}>
                    <Typography sx={{ color: COLOR_CODE.WHITE }}>My Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Typography sx={{ color: COLOR_CODE.WHITE }}>Switch User</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleLogout()}>
                    <Typography sx={{ color: COLOR_CODE.WHITE }}>Logout</Typography>
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
