import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import appConfig from 'src/appConfig';
import { IMAGES } from 'src/appConfig/images';
import { isEmpty } from 'src/validations';
import { externalsFooterLink } from './helpers';

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
        <Container maxWidth="md">
          <Grid container spacing={2} pt={3}>
            <Grid item xs={4}>
              <TypoTitle text={'General Inquiries Email'} />
              <TypoDescription text={'rcuh@rcuh.com'} />
              <TypoDescription text={''} />

              <TypoTitle text={'HR & Payroll Inquiries Email'} />
              <TypoDescription text={'rcuhhr@rcuh.com'} />
            </Grid>
            <Grid item xs={4}>
              <TypoTitle text={'Accounting & Project Admin'} />
              <TypoDescription text={'808.988.8300'} />
              <TypoDescription text={'2800 Woodlawn Drive, Suite 200 | Honolulu, HI 96822'} />
              <TypoDescription text={''} />

              <TypoTitle text={'Human Resources/ Payroll '} />
              <TypoDescription text={'808.956.3100'} />
              <TypoDescription
                text={'1601 East-West Road | Burns Hall 4th Floor, Makai Wing | Honolulu, HI 96848'}
              />
            </Grid>
            <Grid item xs={4}>
              <TypoTitle text={'Disbursing / Procurement'} />
              <TypoDescription text={'808.956.3608'} />
              <TypoDescription text={'2800 Woodlawn Drive, Suite 200 | Honolulu, HI 96822'} />
              <TypoDescription text={''} />

              <TypoTitle text={`Executive Director's Office`} />
              <TypoDescription text={'808.988.8311'} />
              <TypoDescription text={'2800 Woodlawn Drive, Suite 200 | Honolulu, HI 96822'} />
              <TypoDescription text={''} />
            </Grid>
          </Grid>
          <Box pt={2}>
            <Stack flexDirection={'row'} justifyContent="center">
              {externalsFooterLink.map((item) => (
                <Link href={item.url} key={item.title}>
                  <Typography variant="body2" fontWeight={'bold'} color="white" mr={4}>
                    {item.title}
                  </Typography>
                </Link>
              ))}
            </Stack>
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

const TypoDescription = ({ text }) => {
  return (
    <Typography variant="subtitle1" color={'white'}>
      {!isEmpty(text) ? text : <br />}
    </Typography>
  );
};

type Props = {};

export default Footer;
