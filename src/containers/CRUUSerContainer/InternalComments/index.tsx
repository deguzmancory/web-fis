import { Box, Grid } from '@mui/material';
import React from 'react';
import { TextArea } from 'src/components/common';
import { CRUUSER_KEY } from '../enums';
import { CRUUserFormikProps, getErrorMessage } from '../helper';
import _ from 'lodash';

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
export default React.memo(InternalComments, (prevProps, nextProps) => {
  const prevCommentsValues = prevProps.formikProps.values.comments;
  const nextCommentsValues = nextProps.formikProps.values.comments;
  return _.isEqual(prevCommentsValues, nextCommentsValues);
});
