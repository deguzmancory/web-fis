import { Box, Grid } from '@mui/material';
import React from 'react';
import { CRUUSER_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import SelectPICode from './SelectPICode';
import UserTypeInfoForm from '../shared/UserTypeInfoForm';

const PIDetails: React.FC<Props> = ({ formikProps, isLoading }) => {
  return (
    <Box>
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <></>
          </Grid>
          <Grid item xs={12} sm={10}>
            <p>Search</p>
          </Grid>
          <Grid item xs={12} sm={2}>
            <SelectPICode isLoading={isLoading} formikProps={formikProps} />
          </Grid>
          <Grid item xs={12} sm={10}>
            <p>Table</p>
          </Grid>
        </Grid>
      </Box>
      <Box p={2}>
        <UserTypeInfoForm
          title="Principal Investigator Default Purchase Requisition or Payment Request Information"
          isLoading={isLoading}
          formikProps={formikProps}
          prefix={`${CRUUSER_KEY.FIS_PI_INFO}`}
        />
      </Box>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default PIDetails;
