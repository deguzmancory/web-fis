import { Box, Typography } from '@mui/material';
import React from 'react';
import { CRUUserFormikProps } from '../../helper';
import TableGrantDelegation from './table';

const GrantDelegation: React.FC<Props> = ({ formikProps }) => {
  // const { errors, touched, getFieldProps } = formikProps;

  // const _getErrorMessage = (fieldName: CRUUSER_KEY) => {
  //   return getErrorMessage(fieldName, { touched, errors });
  // };

  return (
    <Box>
      <Typography variant="body1" mb={2}>
        Give Delegate Account Access to Another User(s)
      </Typography>
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
