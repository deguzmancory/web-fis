import { Box, Typography } from '@mui/material';
import React from 'react';
import { CRUUserFormikProps } from '../../helper';
import AddDelegation from './addDelegation';
import TableGrantDelegation from './table';

const GrantDelegation: React.FC<Props> = ({ formikProps }) => {
  const isViewOnly = React.useMemo(() => {
    return formikProps.values.isViewOnly;
  }, [formikProps.values.isViewOnly]);

  return (
    <Box>
      {!isViewOnly && (
        <>
          <Typography variant="body1" mb={2}>
            Give Delegate Account Access to Another User(s)
          </Typography>
          <AddDelegation formikProps={formikProps} />
        </>
      )}

      <Typography variant="body1" mb={1}>
        Users Who Have Been Granted Access to This Account
      </Typography>
      <TableGrantDelegation formikProps={formikProps} />
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
};
export default GrantDelegation;
