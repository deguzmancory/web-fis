import { Box, Typography } from '@mui/material';
import React from 'react';
import { Input } from 'src/components/common';
import SignatureBox from 'src/containers/shared/SignatureBox';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
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
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return isEqualPrevAndNextFormikValues({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender: [PO_FORM_KEY.SIGNATURE],
  });
});
