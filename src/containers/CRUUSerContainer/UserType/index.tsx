import { Box, Typography } from '@mui/material';
import React from 'react';
import { Accordion } from 'src/components/common';
import { CRUUserFormikProps } from '../helper';
import GiveDelegation from './GiveDelegation';
import ReceivedDelegation from './ReceivedDelegation';

const UserType: React.FC<Props> = ({ formikProps }) => {
  return (
    <Box>
      <Typography variant="h3" mb={3}>
        User Type
      </Typography>
      <Box>
        <Accordion title={'Delegation'} isExpanded={true}>
          <GiveDelegation formikProps={formikProps} />
          <ReceivedDelegation formikProps={formikProps} />
        </Accordion>
      </Box>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
};
export default UserType;
