import { Box, Grid } from '@mui/material';
import React from 'react';
import { CRUUSER_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps, isEditProfileMode } from 'src/containers/CRUUSerContainer/helper';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { PIDetail } from 'src/queries/Users/types';
import SearchProjects from '../shared/SearchProjects';
import TableProjects from '../shared/TableProjects';
import UserTypeInfoForm from '../shared/UserTypeInfoForm';
import SelectPICodes from './SelectPICodes';

const SUDetails: React.FC<Props> = ({ formikProps, isLoading }) => {
  const isInEditProfileMode = isEditProfileMode(formikProps.values.mode);

  return (
    <Box>
      <Box p={2}>
        <Grid container spacing={2}>
          {!isInEditProfileMode && (
            <>
              <Grid item xs={12} sm={2}>
                <></>
              </Grid>
              <Grid item xs={12} sm={10}>
                <SearchProjects
                  prefix={`${CRUUSER_KEY.FIS_SU_INFO}`}
                  isLoading={isLoading}
                  formikProps={formikProps}
                  type={ROLE_NAME.SU}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={2}>
            <SelectPICodes isLoading={isLoading} formikProps={formikProps} />
          </Grid>

          <Grid item xs={12} sm={10}>
            <TableProjects
              prefix={`${CRUUSER_KEY.FIS_SU_INFO}`}
              isLoading={isLoading}
              formikProps={formikProps}
              type={ROLE_NAME.SU}
            />
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
