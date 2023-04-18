import { Box, Typography } from '@mui/material';
import { Input } from 'src/components/common';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/PO/enums';
import SignatureBox from 'src/containers/shared/SignatureBox';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { UpdatePOPaymentFormikProps } from '../types';
import { PO_MODE } from 'src/queries';
import { memo } from 'react';

const AuthorizedBy: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="body2">
        I certify that services have been rendered and/or that the materials, supplies, and
        incidentals have been received in good order and condition.
      </Typography>

      <SignatureBox />

      <Box mt={2}>
        <Input
          label={'Authorized by'}
          errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_AUTHORIZED_BY)}
          {...getUncontrolledFieldProps(PO_FORM_KEY.PAYMENT_AUTHORIZED_BY)}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
};

type Props = {
  formikProps: UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default memo(AuthorizedBy, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [PO_FORM_KEY.PAYMENT_AUTHORIZED_BY],
    })
  );
});
