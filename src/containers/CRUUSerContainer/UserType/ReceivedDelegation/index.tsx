import { Box, Typography } from '@mui/material';
import React from 'react';
import { CRUUserFormikProps } from '../../helper';
import TableReceivedDelegation from './table';

const ReceivedDelegation: React.FC<Props> = ({ formikProps }) => {
  // const { errors, touched, getFieldProps } = formikProps;

  // const _getErrorMessage = (fieldName: CRUUSER_KEY) => {
  //   return getErrorMessage(fieldName, { touched, errors });
  // };

  return (
    <Box mt={2}>
      <Typography variant="body1" mb={1}>
        Received Delegate Account Access from User(s)
      </Typography>
      <TableReceivedDelegation formikProps={formikProps} />
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
};
export default ReceivedDelegation;
