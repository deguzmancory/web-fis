import { ArrowDropDown } from '@mui/icons-material';
import { Box, Divider, MenuItem, MenuList, Paper, Popover, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { useLogout } from 'src/queries';
import { getRoleName } from 'src/queries/Profile/helpers';
import { Callback } from 'src/redux/types';
import { Navigator } from 'src/services';

const UserMenu: React.FC<Props> = ({ setIsClickedLogout, currentRole, fullName }) => {
  const anchorRef = React.useRef(null);
  const [openPopover, setOpenPopover] = React.useState(false);

  const { logout } = useLogout();

  const handleLogout = React.useCallback(() => {
    setIsClickedLogout(true);
    logout();
  }, [logout, setIsClickedLogout]);

  const handleToggleMenu = () => {
    setOpenPopover((prev) => !prev);
  };

  const menuOptions = React.useMemo(() => {
    return [
      {
        title: 'Edit My Profile',
        onClick: () => {
          Navigator.navigate(PATHS.myProfile);
          handleToggleMenu();
        },
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
          onMouseEnter={handleToggleMenu}
          sx={{
            cursor: 'pointer',
          }}
        >
          <Stack flexDirection={'row'} alignItems="center">
            <Typography
              variant="subtitle1"
              sx={{
                color: COLOR_CODE.WHITE,
                textAlign: 'right',
                whiteSpace: 'nowrap',
                width: '150px',
                overflow: 'hidden',
              }}
            >
              {fullName || 'Anonymous'}
            </Typography>
            <ArrowDropDown
              fontSize="small"
              sx={{
                transform: 'translateX(5px)',
              }}
            />
          </Stack>

          <Box>
            <Typography variant="body2" sx={{ color: COLOR_CODE.PRIMARY_500, textAlign: 'right' }}>
              {getRoleName(currentRole) || 'Unknown Role'}
            </Typography>
            <Divider sx={{ background: COLOR_CODE.PRIMARY_600 }} />
          </Box>
        </Box>
        <Popover
          open={openPopover}
          onClose={handleToggleMenu}
          onMouseLeave={handleToggleMenu}
          anchorEl={anchorRef.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Paper
            onMouseLeave={handleToggleMenu}
            sx={{ background: COLOR_CODE.PRIMARY_700, width: 177 }}
          >
            <MenuList>
              {menuOptions.map((item) => (
                <MenuItem
                  onClick={item.onClick}
                  key={item.title}
                  sx={{
                    '&:hover': {
                      bgcolor: COLOR_CODE.PRIMARY_700,
                      '& *': {
                        color: COLOR_CODE.INFO,
                      },
                    },
                  }}
                >
                  <Typography color={COLOR_CODE.WHITE} variant="body2">
                    {item.title}
                  </Typography>
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </Popover>
      </Stack>
    </>
  );
};

type Props = {
  fullName: string;
  currentRole: string;
  setIsClickedLogout: Callback;
};

export default UserMenu;
