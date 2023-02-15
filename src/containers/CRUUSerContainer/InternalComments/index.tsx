import { Box, Grid } from '@mui/material';
import React from 'react';
import { TextArea } from 'src/components/common';
import { CRUUSER_KEY } from '../enums';
import { CRUUserFormikProps, getErrorMessage } from '../helper';

const InternalComments: React.FC<Props> = ({ formikProps, isLoading }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: CRUUSER_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <TextArea
            label={'Internal Comments'}
            errorMessage={_getErrorMessage(CRUUSER_KEY.COMMENTS)}
            {...getUncontrolledFieldProps(CRUUSER_KEY.COMMENTS)}
            disabled={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default InternalComments;
