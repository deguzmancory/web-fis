import { Box, Grid } from '@mui/material';
import React from 'react';
import { TextArea } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps, UpsertPOFormValue } from '../types';

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
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender: [PO_FORM_KEY.PO_COMMENTS],
  });
});
