import { Box, Link as MuiLink, Typography } from '@mui/material';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { NO_OPENER } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { dashboardItems } from 'src/containers/Dashboard/helpers';
import { Navigator, PermissionsService } from 'src/services';
import { isEmpty } from 'src/validations';
const clsPrefix = 'ctn-navbar-desktop';

type Props = {
  userRole: string;
};

const MainMenu: React.FC<Props> = ({ userRole }) => {
  const myPermissions = PermissionsService.getPermissions();

  return (
    <>
      <Box
        className={`${clsPrefix}-item`}
        sx={{
          cursor: 'pointer',
        }}
        my={'auto'}
        onClick={() => {
          Navigator.navigate(PATHS.dashboard);
        }}
      >
        <Typography variant="body2" className={`${clsPrefix}-link`}>
          Main Menu
        </Typography>
      </Box>
      {dashboardItems.map((item) => (
        <Box
          className={`${clsPrefix}-item`}
          sx={{
            cursor: 'pointer',
          }}
          key={item.title}
          my={'auto'}
        >
          <Typography variant="body2" className={`${clsPrefix}-link`}>
            {item.title}
          </Typography>
          <Box
            className={classNames(`${clsPrefix}-item__sub subItems`, {
              isLeft: item?.isDisplayLeft,
            })}
          >
            {[
              item.items.map((subItem) => {
                const isShow = subItem.roles.some((role) => role === userRole);
                const needPermission = !isEmpty(subItem.permissions);
                const hasPermission =
                  needPermission &&
                  subItem.permissions.some((permission) => myPermissions.includes(permission));

                return isShow && (needPermission ? hasPermission : true) ? (
                  <Box className={`subItem`} key={subItem.title}>
                    {subItem.isExternalUrl ? (
                      <MuiLink
                        {...(subItem?.url && {
                          href: subItem.url,
                          target: '_blank',
                          rel: NO_OPENER,
                        })}
                        underline="none"
                      >
                        {subItem.title}
                      </MuiLink>
                    ) : (
                      <Link to={subItem.url}>
                        <Typography variant="body2">{subItem.title}</Typography>
                      </Link>
                    )}
                  </Box>
                ) : (
                  <React.Fragment key={subItem.title} />
                );
              }),
            ]}
          </Box>
        </Box>
      ))}
    </>
  );
};

export default MainMenu;
