import { ArrowDropDown } from '@mui/icons-material';
import { Box, Divider, MenuItem, MenuList, Paper, Popover, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { useLogout, useProfile } from 'src/queries';
import { Callback } from 'src/redux/types';
import { Navigator, TokenService } from 'src/services';

type Props = {
  fullName: string;
  setIsClickedLogout: Callback;
};

const UserMenu: React.FC<Props> = ({ fullName, setIsClickedLogout }) => {
  const anchorRef = React.useRef(null);
  const [openPopover, setOpenPopover] = React.useState(false);

  const { profile } = useProfile();
  const { roleName } = profile || {};
  const { logout } = useLogout();

  const handleLogout = React.useCallback(() => {
    setIsClickedLogout(true);
    logout();
    TokenService.clearToken();
  }, [logout, setIsClickedLogout]);

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
        onClick: () => {
          Navigator.navigate(PATHS.switchUser);
          handleToggleMenu();
        },
      },
      {
        title: 'Log out',
        onClick: () => handleLogout(),
      },
    ];
  }, [handleLogout]);

  return (
    <>
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
};

export default UserMenu;
