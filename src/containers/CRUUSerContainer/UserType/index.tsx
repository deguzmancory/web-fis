import { Box, Typography } from '@mui/material';
import React from 'react';
import { Accordion } from 'src/components/common';
import { CRUUserFormikProps, isAddUserMode } from '../helper';
import Layout from '../layout';
import UserTypeDetails from './Details';
import GrantDelegation from './GrantDelegation';
import ReceivedDelegation from './ReceivedDelegation';
import SelectUserType from './SelectUserType';

const UserType: React.FC<Props> = ({ formikProps, isLoading }) => {
  const { values } = formikProps;

  return (
    <Box>
      <Typography variant="h3">User Type</Typography>
      <Box my={3}>
        <SelectUserType formikProps={formikProps} isLoading={isLoading} />
      </Box>

      <Box>
        <Accordion title={'Delegation'} disabled={isAddUserMode(values.mode)}>
          <GrantDelegation formikProps={formikProps} />
          <ReceivedDelegation formikProps={formikProps} />
        </Accordion>
      </Box>

      <Layout
        sx={{
          padding: '0 0 16px 0',
        }}
      >
        <UserTypeDetails formikProps={formikProps} />
      </Layout>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default UserType;
