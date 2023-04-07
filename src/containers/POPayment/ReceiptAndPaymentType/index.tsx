import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { TextareaAutosize } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/POPayment/types';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';

const ReceiptAndPaymentType: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="h6" mb={1}>
        Receipt Acknowledgment and Payment Authorization Exception(s):
      </Typography>
      <TextareaAutosize
        label={''}
        errorMessage={_getErrorMessage(PO_FORM_KEY.PO_COMMENTS)}
        {...getUncontrolledFieldProps(PO_FORM_KEY.PO_COMMENTS)}
        disabled={disabled}
        minRows={2}
      />
    </Box>
  );
};

type Props = {
  formikProps: UpdatePOPaymentFormikProps;
  disabled?: boolean;
};

export default React.memo(ReceiptAndPaymentType, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [PO_FORM_KEY.PO_COMMENTS],
    })
  );
});
