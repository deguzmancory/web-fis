import { Email, LocationOn, Phone } from '@mui/icons-material';
import { Box, Container, Grid, Icon, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import appConfig from 'src/appConfig';
import { IMAGES } from 'src/appConfig/images';
import { isEmpty } from 'src/validations';

const Footer: React.FC<Props> = () => {
  return (
    <Box>
      <Box
        bgcolor={'grey.700'}
        color="white"
        sx={{
          backgroundImage: `url(${IMAGES.backgroundDiamondFooter})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom left',
          backgroundSize: 'contain',
        }}
      >
        <Container maxWidth="lg">
          <Grid flexDirection={'row'} container spacing={1} pt={3}>
            <Box width={'260px'}>
              <TypoTitle text={'General Inquiries Email'} />
              <TypoDescription text={' rcuh@rcuh.com'} type={'email'} />
              <TypoDescription text={''} type={''} />

              <TypoTitle text={'HR & Payroll Inquiries Email'} />
              <TypoDescription text={' rcuhhr@rcuh.com'} type={'email'} />
            </Box>
            <Box width={'calc(100% - 260px)'}>
              <Grid width="100%" container spacing={1}>
                <Grid item xs={6}>
                  <TypoTitle text={'Human Resources/ Payroll '} />
                  <TypoDescription text={'808.956.3100'} type={'phone'} />
                  <TypoDescription
                    text={
                      '1601 East-West Road | Burns Hall 4th Floor, Makai Wing | Honolulu, HI 96848'
                    }
                    type={'location'}
                  />

                  <TypoDescription text={' '} type="" />

                  <TypoTitle text={'Accounting & Project Admin'} />
                  <TypoDescription text={'808.988.8300'} type={'phone'} />
                  <TypoDescription
                    text={'2800 Woodlawn Drive, Suite 200 | Honolulu, HI 96822'}
                    type={'location'}
                  />
                </Grid>
                <Grid item xs={6} container justifyContent={'flex-end'}>
                  <Grid item xs={11}>
                    <TypoTitle text={'Disbursing / Procurement'} />
                    <TypoDescription text={'808.956.3608'} type={'phone'} />
                    <TypoDescription
                      text={'2800 Woodlawn Drive, Suite 200 | Honolulu, HI 96822'}
                      type={'location'}
                    />

                    <TypoDescription text={' '} type="" />

                    <Box
                      sx={{
                        transform: 'translateY(16px)',
                      }}
                    >
                      <TypoTitle text={`Executive Director's Office`} />
                      <TypoDescription text={'808.988.8311'} type={'phone'} />
                      <TypoDescription
                        text={'2800 Woodlawn Drive, Suite 200 | Honolulu, HI 96822'}
                        type={'location'}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Box>
            <Stack flexDirection={'row'} justifyContent="center" py={1}>
              <Typography variant="body2" fontWeight={'bold'} color="white">
                If you require assistance in accessing content on this website, please contact
                <Link href="mailto:rcuh@rcuh.com" underline="hover" color="white" className="ml-1">
                  rcuh@rcuh.com
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
      <Box bgcolor={'primary.main'} py={1} borderTop={'1px solid white'}>
        <Stack flexDirection={'row'} justifyContent="center" alignItems="center" my={1}>
          <Typography variant="body2" mr={3} color={'white'}>
            © {new Date().getFullYear()} The Research Corporation of the University of Hawai’i
          </Typography>
          <Typography variant="body2" color={'white'}>
            v{appConfig.APP_VERSION}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

const TypoTitle = ({ text }) => {
  return (
    <Typography variant="subtitle1" fontWeight={'bold'} color={'white'}>
      {!isEmpty(text) ? text : <br />}
    </Typography>
  );
};

const TypoDescription = ({ text, type }) => {
  const getIconName = (type) => {
    switch (type) {
      case 'email':
        return <Email fontSize="small" />;
      case 'phone':
        return <Phone fontSize="small" />;
      case 'location':
        return <LocationOn fontSize="small" />;
      default:
        break;
    }
  };

  return (
    <Stack flexDirection="row" alignItems={'flex-start'}>
      <Icon
        sx={{
          '& svg': {
            transform: 'translateY(-8px)',
          },
        }}
      >
        {getIconName(type)}
      </Icon>
      <Typography variant="subtitle1" color={'white'} className="ml-1">
        {!isEmpty(text) ? text : <br />}
      </Typography>
    </Stack>
  );
};

type Props = {};

export default Footer;
