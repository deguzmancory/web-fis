import { Box } from '@mui/material';
import React from 'react';
import { CRUUSER_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import UserTypeInfoForm from '../shared/UserTypeInfoForm';

const PIDetails: React.FC<Props> = ({ formikProps, isLoading }) => {
  return (
    <Box p={2}>
      <UserTypeInfoForm
        title="Principal Investigator Default Purchase Requisition or Payment Request Information"
        isLoading={isLoading}
        formikProps={formikProps}
        prefix={`${CRUUSER_KEY.FIS_PI_INFO}`}
      />
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default PIDetails;
