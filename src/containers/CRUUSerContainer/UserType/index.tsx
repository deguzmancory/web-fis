import { Box, Typography } from '@mui/material';
import React from 'react';
import { Accordion } from 'src/components/common';
import { CRUUserFormikProps } from '../helper';
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
      {values.isViewMode && (
        <Box>
          <Accordion title={'Delegation'}>
            <GrantDelegation formikProps={formikProps} />
            <ReceivedDelegation formikProps={formikProps} />
          </Accordion>
        </Box>
      )}
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default UserType;
