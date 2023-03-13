import { Box, Grid } from '@mui/material';
import React from 'react';
import { TextArea } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextObjByPath } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps } from '../types';

const InternalComments: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <TextArea
            label={'Internal Comments'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.PO_COMMENTS)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.PO_COMMENTS)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
};

export default React.memo(InternalComments, (prevProps, nextProps) => {
  const prevFormikValues = prevProps.formikProps.values;
  const nextFormikValues = nextProps.formikProps.values;

  return isEqualPrevAndNextObjByPath({
    prevValues: prevFormikValues,
    nextValues: nextFormikValues,
    path: PO_FORM_KEY.PO_COMMENTS,
  });
});
