import { Box, Grid } from '@mui/material';
import React from 'react';
import { Input, InputPhone } from 'src/components/common';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';
import { PO_MODE } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { UpdatePOPaymentFormValue, UpdatePOPaymentFormikProps } from '../types';

const PaymentGeneralInfo: React.FC<Props> = ({ formikProps, disabled = false, currentPOMode }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Date'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.DATE)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.DATE)}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Payment Req No.'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.NUMBER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.NUMBER)}
              placeholder={'To be assigned'}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Direct Inquiries on This Request To'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.ORIGINAL_PO_NUMBER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.ORIGINAL_PO_NUMBER)}
              placeholder={'To be assigned'}
              required
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputPhone
              label={'Phone Number'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.PHONE_NUMBER)}
              {...getFieldProps(PO_FORM_KEY.PHONE_NUMBER)}
              disabled={disabled}
              onChange={setFieldValue}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'FA Staff to Review'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.FA_STAFF_REVIEWER)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.FA_STAFF_REVIEWER)}
              disabled={disabled}
            />
          </Grid>
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
    PO_FORM_KEY.LOGIN_NAME,
    PO_FORM_KEY.DATE,
    PO_FORM_KEY.NUMBER,
    PO_FORM_KEY.PROJECT_TITLE,
    PO_FORM_KEY.PHONE_NUMBER,
    PO_FORM_KEY.PI_NAME,
    PO_FORM_KEY.PROJECT_PERIOD,
    PO_FORM_KEY.SUPER_QUOTE_NUMBER,
    PO_FORM_KEY.SUPER_QUOTE_BID_ID,
    PO_FORM_KEY.VENDOR_NAME,
    PO_FORM_KEY.VENDOR_CODE,
    PO_FORM_KEY.VENDOR_ADDRESS,
    PO_FORM_KEY.SHIP_OTHER,
    PO_FORM_KEY.SHIP_VIA,
    PO_FORM_KEY.SHIP_TO,
    PO_FORM_KEY.DELIVERY_BY,
    PO_FORM_KEY.DISCOUNT_TERMS,
    PO_FORM_KEY.QUOTATION_NUMBER,
    PO_FORM_KEY.DIRECT_INQUIRIES_TO,
    PO_FORM_KEY.PHONE_NUMBER,
    PO_FORM_KEY.FA_STAFF_REVIEWER,
    PO_FORM_KEY.DOCUMENT_TYPE,
    PO_FORM_KEY.FORM_NUMBER,
    PO_FORM_KEY.ORIGINAL_PO_NUMBER,
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
