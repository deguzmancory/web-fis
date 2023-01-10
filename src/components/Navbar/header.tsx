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
              target: '_blank',
              rel: NO_OPENER,
            })}
            key={item.label}
            className={`${clsPrefix}-link`}
            sx={{
              fontSize: 12,
            }}
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
                      target: '_blank',
                      rel: NO_OPENER,
                    })}
                    fontWeight="bold"
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
  );
};

export default Header;
