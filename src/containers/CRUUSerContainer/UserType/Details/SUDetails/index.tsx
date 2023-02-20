import { Box, Grid } from '@mui/material';
import React from 'react';
import { CRUUSER_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import UserTypeInfoForm from '../shared/UserTypeInfoForm';
import { PIDetail } from 'src/queries/Users/types';
import SelectPICodes from './SelectPICodes';

const SUDetails: React.FC<Props> = ({ formikProps, isLoading }) => {
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
            <SelectPICodes
              prefix={`${CRUUSER_KEY.FIS_SU_INFO}`}
              isLoading={isLoading}
              formikProps={formikProps}
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <p>Table</p>
          </Grid>
        </Grid>
      </Box>
      <Box p={2}>
        <UserTypeInfoForm
          title="Secondary User Default Purchase Requisition or Payment Request Information"
          isLoading={isLoading}
          formikProps={formikProps}
          prefix={`${CRUUSER_KEY.FIS_SU_INFO}`}
        />
      </Box>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
  initialPIInfo: PIDetail;
};
export default SUDetails;
