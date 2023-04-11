import { Box, Grid } from '@mui/material';
import React from 'react';
import { Input, InputPhone } from 'src/components/common';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';
import { PO_MODE } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { UpdatePOPaymentFormValue, UpdatePOPaymentFormikProps } from '../types';

const PaymentGeneralInfo: React.FC<Props> = ({ formikProps, disabled = false, currentPOMode }) => {
  const { errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Login Name'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_LOGIN_NAME)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.PAYMENT_LOGIN_NAME)}
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Date'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_DATE)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.PAYMENT_DATE)}
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Payment Req No.'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_REQUEST_NUMBER)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.PAYMENT_REQUEST_NUMBER)}
            placeholder={'To be assigned'}
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Direct Inquiries on This Request To'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_DIRECT_INQUIRIES_TO)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.PAYMENT_DIRECT_INQUIRIES_TO)}
            placeholder={'To be assigned'}
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_PHONE_NUMBER)}
            {...getFieldProps(PO_FORM_KEY.PAYMENT_PHONE_NUMBER)}
            disabled={disabled}
            onChange={setFieldValue}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'FA Staff to Review'}
            required
            errorMessage={_getErrorMessage(PO_FORM_KEY.PAYMENT_FA_STAFF_REVIEWER)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.PAYMENT_FA_STAFF_REVIEWER)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default React.memo(PaymentGeneralInfo, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_FORM_KEY.PAYMENT_LOGIN_NAME,
    PO_FORM_KEY.PAYMENT_DATE,
    PO_FORM_KEY.PAYMENT_REQUEST_NUMBER,
    PO_FORM_KEY.PAYMENT_DIRECT_INQUIRIES_TO,
    PO_FORM_KEY.PAYMENT_PHONE_NUMBER,
    PO_FORM_KEY.PAYMENT_FA_STAFF_REVIEWER,
  ]; // only re-render if keys using in this component change

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    isEqualPrevAndNextFormikValues<UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
