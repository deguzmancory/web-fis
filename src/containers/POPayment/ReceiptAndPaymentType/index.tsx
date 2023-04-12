import { Box, Typography } from '@mui/material';
import React from 'react';
import { Element, RadioButton, TextareaAutosize } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/POPayment/types';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';
import { RadioGroupOptions } from 'src/components/common/RadioButton';
import { PO_PAYMENT_TYPE, PO_MODE } from 'src/queries';

export const paymentReceiptAcknowledgementOptions: RadioGroupOptions = [
  {
    label: 'Partial Payment',
    value: PO_PAYMENT_TYPE.PARTIAL_PAYMENT,
  },
  {
    label: 'Final Payment',
    value: PO_PAYMENT_TYPE.FINAL_PAYMENT,
  },
  {
    label: '',
    subLabel: (
      <Typography variant="body2">
        Advance Payment{' '}
        <span style={{ fontStyle: 'italic' }}>(Uses an RCUH Internal Account for payment)</span>
      </Typography>
    ),
    value: PO_PAYMENT_TYPE.ADVANCE_PAYMENT,
  },
];

const ReceiptAndPaymentType: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } = formikProps;

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
        errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_RECEIPT_ACKNOWLEDGEMENT)}
        {...getUncontrolledFieldProps(PO_FORM_KEY.PAYMENT_RECEIPT_ACKNOWLEDGEMENT)}
        disabled={disabled}
        minRows={2}
        className="mb-4"
      />
      <Element errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_TYPE)} showErrorBorder>
        <RadioButton
          label={<b>Payment Type:</b>}
          columns={1}
          required
          options={paymentReceiptAcknowledgementOptions}
          {...getFieldProps(PO_FORM_KEY.PAYMENT_TYPE)}
          onChange={setFieldValue}
          itemClassName="mb-except-last-8"
          disabled={disabled}
        />
      </Element>
    </Box>
  );
};

type Props = {
  formikProps: UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default React.memo(ReceiptAndPaymentType, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    isEqualPrevAndNextFormikValues<UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [PO_FORM_KEY.PAYMENT_RECEIPT_ACKNOWLEDGEMENT, PO_FORM_KEY.PAYMENT_TYPE],
    })
  );
});
