/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, Typography, Link as MuiLink } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { COLOR_CODE, NO_OPENER } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { UAMBody } from '../common';

const Signup: React.FC<Props> = () => {
  return (
    <UAMBody bodyWidth="600px">
      <Stack justifyContent={'center'} mt={2}>
        <Typography variant="h5" textAlign={'center'} mb={2}>
          Instructions for obtaining an account with the RCUH Financial System:
        </Typography>
        <Typography variant="body2" mb={1}>
          The Financial Portal Access Form grants authorized users access to the RCUH Financial
          Portal to process online transactions.
        </Typography>
        <Typography variant="body2" mb={1}>
          To obtain access to the RCUH Financial Portal, please complete and submit{' '}
          <MuiLink
            color={COLOR_CODE.INFO}
            href="https://www.rcuh.com/document-library/financial-portal/financial-portal-access-form/"
            target={'_blank'}
            rel={NO_OPENER}
          >
            this form
          </MuiLink>{' '}
          to RCUH.
        </Typography>

        <Stack flexDirection={'row'} justifyContent="center">
          <Link to={PATHS.signIn}>
            <Button variant="link">Return to Login Page</Button>
          </Link>
        </Stack>
      </Stack>
    </UAMBody>
  );
};

type Props = {};

export default Signup;
