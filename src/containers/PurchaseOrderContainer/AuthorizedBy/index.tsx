import { Box, Typography } from '@mui/material';
import React from 'react';
import { Input } from 'src/components/common';
import SignatureBox from 'src/components/SignatureBox';
import { getErrorMessage, isEqualPrevAndNextObjByPath } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps } from '../types';

const AuthorizedBy: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="h5">Authorized by:</Typography>

      <SignatureBox maxWidth={'50%'} />

      <Box mt={2} maxWidth={'50%'}>
        <Input
          label={'Full Name of Authorized by'}
          errorMessage={_getErrorMessage(PO_FORM_KEY.SIGNATURE)}
          {...getUncontrolledFieldProps(PO_FORM_KEY.SIGNATURE)}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
};

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
};

export default React.memo(AuthorizedBy, (prevProps, nextProps) => {
  const prevFormikValues = prevProps.formikProps.values;
  const nextFormikValues = nextProps.formikProps.values;

  return isEqualPrevAndNextObjByPath({
    prevValues: prevFormikValues,
    nextValues: nextFormikValues,
    path: PO_FORM_KEY.SIGNATURE,
  });
});
