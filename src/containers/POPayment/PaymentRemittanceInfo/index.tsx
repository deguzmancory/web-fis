import React from 'react';
import { UpdatePOPaymentFormikProps } from '../types';
import { PO_MODE } from 'src/queries';
import { Box, Typography } from '@mui/material';
import TableLineItems from './LineItems';
import QuestionOnRemittance from './QuestionOnRemittance';

const PaymentRemittanceInfo: React.FC<Props> = ({
  formikProps,
  disabled = false,
  currentPOMode,
}) => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Remittance Information:
      </Typography>
      <TableLineItems formikProps={formikProps} disable={disabled} />

      <QuestionOnRemittance formikProps={formikProps} disabled={disabled} />
    </Box>
  );
};

type Props = {
  formikProps: UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default PaymentRemittanceInfo;
