import { Box } from '@mui/material';
import React from 'react';
import { CRUUSER_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import UserTypeInfoForm from '../shared/UserTypeInfoForm';

const FADetails: React.FC<Props> = ({ formikProps, isLoading }) => {
  return (
    <Box p={2}>
      <UserTypeInfoForm
        title="Fiscal Administrator - Send Invoice in Duplicate To"
        isLoading={isLoading}
        formikProps={formikProps}
        prefix={`${CRUUSER_KEY.FIS_FA_INFO}`}
        showGeneralInfoSection={false}
      />
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default FADetails;
