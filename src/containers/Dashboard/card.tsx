import { Icon, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Link } from 'react-router-dom';
import { COLOR_CODE, NO_OPENER } from 'src/appConfig/constants';
import { DashboardItem } from './helpers';

const CardDashboard: React.FC<Props> = ({ card, userRoles }) => {
  return (
    <Box
      minHeight={'100%'}
      p={4}
      bgcolor={COLOR_CODE.WHITE}
      border={COLOR_CODE.DEFAULT_BORDER}
      borderRadius={'4px'}
    >
      <Box>
        <Stack flexDirection={'row'} justifyContent={'center'}>
          <Icon
            sx={{
              fontSize: 75,
              mb: 2,
            }}
            color="info"
          >
            {card.icon}
          </Icon>
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
          const isShow = item.roles.some((role) => userRoles.includes(role));
          return isShow ? (
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
            <></>
          );
        })}
      </Box>
    </Box>
  );
};

type Props = {
  card: DashboardItem;
  userRoles: string[];
};

export default CardDashboard;
