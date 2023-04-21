import { Box, Grid, Typography } from '@mui/material';
import { Input, TextareaAutosize } from 'src/components/common';
import SignatureBox from 'src/containers/shared/SignatureBox';
import { getErrorMessage } from 'src/utils';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from '../enum';
import { UpsertAuthorizationPaymentFormikProps } from '../types';

const ReasonsForPayment: React.FC<Props> = ({ formikProps, disabled }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: any) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <TextareaAutosize
        label={
          <>
            <Typography variant="body2" fontWeight="bold" style={{ display: 'contents' }}>
              Reasons for Payment{' '}
            </Typography>
            <Typography variant="body2" style={{ display: 'contents' }}>
              (Including Period Covered, Rate of Compensation, Reference to Letters)
            </Typography>
          </>
        }
        {...getUncontrolledFieldProps(`${AUTHORIZATION_FOR_PAYMENT_KEY.REASON_FOR_PAYMENT}`)}
        disabled={disabled}
        errorMessage={_getErrorMessage(`${AUTHORIZATION_FOR_PAYMENT_KEY.REASON_FOR_PAYMENT}`)}
        resize="none"
        style={{ minHeight: 100 }}
      />
      <Box mt={2}>
        <Typography variant="body2" fontWeight="bold" style={{ display: 'contents' }}>
          PROJECT PAYMENT APPROVAL:
        </Typography>{' '}
        <Typography variant="body2" style={{ display: 'contents' }}>
          I certify that services have been rendered and/or that the materials, supplies and
          incidentals have been received in good order and condition and are in direct support of
          the program as indicated in the project number block.
        </Typography>
      </Box>

      <Grid container justifyContent="space-between">
        <Grid item xs={12} sm={5.9}>
          <SignatureBox style={{ marginBottom: '16px' }} />
          <Input
            label={'Principal Investigator'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.PI_SIGNATURE)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.PI_SIGNATURE)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={5.9}>
          <SignatureBox style={{ marginBottom: '16px' }} />
          <Input
            label={'Fiscal Administrator'}
            errorMessage={_getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.FA_SIGNATURE)}
            {...getUncontrolledFieldProps(AUTHORIZATION_FOR_PAYMENT_KEY.FA_SIGNATURE)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertAuthorizationPaymentFormikProps;
  disabled?: boolean;
};

export default ReasonsForPayment;
