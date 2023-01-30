import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { COLOR_CODE, NO_OPENER } from 'src/appConfig/constants';
import { navbarItems } from './helpers';

const clsPrefix = 'ctn-navbar-desktop';

const Header = () => {
  return (
    <Stack flexDirection={'row'} justifyContent={'flex-end'} bgcolor={COLOR_CODE.PRIMARY_800} p={1}>
      {navbarItems.map((item) => (
        <Box
          className={`${clsPrefix}-item`}
          sx={{
            cursor: 'pointer',
          }}
          key={item.label}
          my={'auto'}
        >
          {item?.isExternalUrl ? (
            <MuiLink
              {...(item?.url && {
                href: item.url,
                target: '_blank',
                rel: NO_OPENER,
              })}
              className={`${clsPrefix}-link`}
              sx={{
                fontSize: 12,
              }}
              underline="none"
            >
              {item.label}
            </MuiLink>
          ) : (
            <Link to={item.url}>
              <Typography variant="subtitle1" className={`${clsPrefix}-link`}>
                {item.label}
              </Typography>
            </Link>
          )}

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
