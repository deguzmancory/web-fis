import { Box, Grid } from '@mui/material';
import React from 'react';
import { CRUUSER_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps, isEditProfileMode } from 'src/containers/CRUUSerContainer/helper';
import SelectFACodes from './SelectFACodes';
import UserTypeInfoForm from '../shared/UserTypeInfoForm';
import SearchProjects from '../shared/SearchProjects';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import TableProjects from '../shared/TableProjects';

const FADetails: React.FC<Props> = ({ formikProps, isLoading }) => {
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
                  prefix={`${CRUUSER_KEY.FIS_FA_INFO}`}
                  isLoading={isLoading}
                  formikProps={formikProps}
                  type={ROLE_NAME.FA}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={2}>
            <SelectFACodes isLoading={isLoading} formikProps={formikProps} />
          </Grid>
          <Grid item xs={12} sm={10}>
            <TableProjects
              prefix={`${CRUUSER_KEY.FIS_FA_INFO}`}
              isLoading={isLoading}
              formikProps={formikProps}
              type={ROLE_NAME.FA}
            />
          </Grid>
        </Grid>
      </Box>
      <Box p={2}>
        <UserTypeInfoForm
          title="Fiscal Administrator - Send Invoice in Duplicate To"
          isLoading={isLoading}
          formikProps={formikProps}
          prefix={`${CRUUSER_KEY.FIS_FA_INFO}`}
          showGeneralInfoSection={false}
        />
      </Box>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default FADetails;
