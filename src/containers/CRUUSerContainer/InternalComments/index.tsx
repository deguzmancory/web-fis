import { Box, Grid } from '@mui/material';
import React from 'react';
import { TextArea } from 'src/components/common';
import { CRUUserFormikProps, CRUUSER_KEY, getErrorMessage } from '../helper';

const InternalComments: React.FC<Props> = ({ formikProps, isLoading }) => {
  const { errors, touched, getFieldProps } = formikProps;

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
            {...getFieldProps(CRUUSER_KEY.COMMENTS)}
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
