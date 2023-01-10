import { Stack, Link as MuiLink, Box } from '@mui/material';
import React from 'react';
import { COLOR_CODE, NO_OPENER } from 'src/appConfig/constants';
import { navbarItems } from './helpers';
import cn from 'classnames';

const clsPrefix = 'ctn-navbar-desktop';

const Header = () => {
  return (
    <Stack
      flexDirection={'row'}
      justifyContent={'flex-end'}
      bgcolor={COLOR_CODE.PRIMARY_800}
      py={1}
    >
      {navbarItems.map((item) => (
        <MuiLink
          {...(item?.url && {
            href: item.url,
            target: '_blank',
            rel: NO_OPENER,
          })}
          key={item.label}
          className={`${clsPrefix}-item ${clsPrefix}-link`}
          sx={{
            fontSize: 12,
          }}
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
                <Box className={`subItem`} key={subItem.label}>
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
  );
};

export default Header;
