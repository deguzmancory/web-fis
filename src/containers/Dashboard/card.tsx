import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { COLOR_CODE, NO_OPENER } from 'src/appConfig/constants';
import { DashboardItem } from './helpers';
import { PermissionsService } from 'src/services';
import { isEmpty } from 'src/validations';

const CardDashboard: React.FC<Props> = ({ card, userRole }) => {
  const myPermissions = PermissionsService.getPermissions();

  return (
    <Box
      minHeight={'100%'}
      py={4}
      px={3}
      bgcolor={COLOR_CODE.WHITE}
      border={COLOR_CODE.DEFAULT_BORDER}
    >
      <Box>
        <Stack flexDirection={'row'} justifyContent={'center'}>
          <i
            style={{
              fontSize: '75',
              color: COLOR_CODE.INFO,
            }}
          >
            {card.icon}
          </i>
        </Stack>
        <Typography variant="h2" textAlign={'center'} color={COLOR_CODE.INFO}>
          {card.title}
        </Typography>
        <Typography variant="body2" textAlign={'center'} color={COLOR_CODE.PRIMARY_600}>
          {card?.subTitle || <br />}
        </Typography>
      </Box>
      <Box mt={2}>
        {card.items.map((item, index) => {
          const isShow = item.roles.some((role) => role === userRole);
          const needPermission = !isEmpty(item.permissions);
          const hasPermission =
            needPermission &&
            item.permissions.some((permission) => myPermissions.includes(permission));

          return isShow && (needPermission ? hasPermission : true) ? (
            <Box key={item.title} py={1} borderBottom={`1px solid ${COLOR_CODE.PRIMARY_100}`}>
              {item.isExternalUrl ? (
                <MuiLink
                  sx={{
                    color: `${COLOR_CODE.PRIMARY_600} !important`,
                    '&:hover': {
                      color: `${COLOR_CODE.INFO} !important`,
                    },
                  }}
                  variant="body2"
                  href={item.url}
                  target="_blank"
                  rel={NO_OPENER}
                >
                  {item.title}
                </MuiLink>
              ) : (
                <Link to={item.url}>
                  <Typography
                    sx={{
                      '&:hover': {
                        color: `${COLOR_CODE.INFO} !important`,
                      },
                    }}
                    variant="body2"
                  >
                    {item.title}
                  </Typography>
                </Link>
              )}
            </Box>
          ) : (
            <React.Fragment key={item.title} />
          );
        })}
      </Box>
    </Box>
  );
};

type Props = {
  card: DashboardItem;
  userRole: string;
};

export default CardDashboard;
