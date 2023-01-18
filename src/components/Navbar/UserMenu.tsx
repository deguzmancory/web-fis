import { ArrowDropDown } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { useLogout, useProfile } from 'src/queries';
import { TokenService } from 'src/services';

export default function UserMenu({ fullName }) {
  const anchorRef = React.useRef(null);
  const [openPopover, setOpenPopover] = React.useState(false);
  const [isClickedLogout, setIsClickedLogout] = React.useState(false);

  const { profile } = useProfile();
  const { roleName } = profile || {};
  const { logout } = useLogout();

  const handleLogout = React.useCallback(() => {
    setIsClickedLogout(true);
    logout();
    TokenService.clearToken();
  }, [logout]);

  const handleToggleMenu = () => {
    setOpenPopover((prev) => !prev);
  };

  const menuOptions = React.useMemo(() => {
    return [
      {
        title: 'Edit My Profile',
        onClick: () => {},
      },
      {
        title: 'Switch User',
        onClick: () => {},
      },
      {
        title: 'Log out',
        onClick: () => handleLogout(),
      },
    ];
  }, [handleLogout]);

  return (
    <>
      {isClickedLogout && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          onClick={() => {}}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Stack width={162} height={32}>
        <Box
          ref={anchorRef}
          onClick={handleToggleMenu}
          sx={{
            cursor: 'pointer',
          }}
        >
          <Typography variant="subtitle1" sx={{ color: COLOR_CODE.WHITE, textAlign: 'right' }}>
            {fullName || 'Anonymous'}
            <ArrowDropDown
              fontSize="small"
              sx={{
                transform: 'translateY(7px)',
              }}
            />
          </Typography>

          <Box>
            <Typography variant="body2" sx={{ color: COLOR_CODE.PRIMARY_500, textAlign: 'center' }}>
              {roleName || 'Unknown'}
            </Typography>
            <Divider sx={{ background: COLOR_CODE.PRIMARY_500 }} />
          </Box>
        </Box>
        <Popover
          open={openPopover}
          onClose={handleToggleMenu}
          anchorEl={anchorRef.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Paper sx={{ background: COLOR_CODE.PRIMARY_800 }}>
            <MenuList>
              {menuOptions.map((item) => (
                <MenuItem onClick={item.onClick} key={item.title}>
                  <Typography color={COLOR_CODE.WHITE}>{item.title}</Typography>
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </Popover>
      </Stack>
    </>
  );
}
