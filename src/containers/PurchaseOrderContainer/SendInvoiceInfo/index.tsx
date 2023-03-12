import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { US_ZIP_CODE_LENGTH } from 'src/appConfig/constants';
import { Checkbox, Input, InputMask, LoadingCommon, Select } from 'src/components/common';
import { useZipCode } from 'src/queries';
import { StateService } from 'src/services';
import { getErrorMessage, isEqualPrevAndNextObjByPath } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps } from '../types';
import { resetAllField } from './helpers';

const SendInvoiceInfo: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const isLeaveBlank = React.useMemo(
    () => values.sendInvoiceToClearFlag,
    [values.sendInvoiceToClearFlag]
  );

  const statesOptions = React.useMemo(() => {
    return StateService.getStates();
  }, []);

  // Zip Code
  const { checkZipCode, isLoading: isLoadingZipCode } = useZipCode({
    onSuccess(data) {
      setFieldValue(PO_FORM_KEY.INVOICE_CITY, data.city);
      setFieldValue(PO_FORM_KEY.INVOICE_STATE, data.state);
      setFieldTouched(PO_FORM_KEY.INVOICE_CITY, false);
      setFieldTouched(PO_FORM_KEY.INVOICE_STATE, false);
    },
    onError(error, variables, context) {},
  });

  const handleChangeZipCode = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    if (value?.length === US_ZIP_CODE_LENGTH) {
      checkZipCode(value);
    } else {
      setFieldValue(PO_FORM_KEY.INVOICE_CITY, '');
      setFieldValue(PO_FORM_KEY.INVOICE_STATE, '');
    }
    setFieldValue(field, value);
  };

  const handleLeaveBlankChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;

    if (value) {
      resetAllField({ setFieldValue, setFieldTouched });
    }

    setFieldValue(PO_FORM_KEY.SEND_INVOICE_TO_CLEAR_FLAG, value);
  };

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="h5" mb={1}>
        Send Invoice In Duplicate To (Printed on PO)
      </Typography>
      <Divider />

      <Checkbox.Item
        label="Leave Blank"
        {...getFieldProps(PO_FORM_KEY.SEND_INVOICE_TO_CLEAR_FLAG)}
        errorMessage={_getErrorMessage(PO_FORM_KEY.SEND_INVOICE_TO_CLEAR_FLAG)}
        onChange={handleLeaveBlankChange}
        disabled={disabled}
        className="my-16"
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Name'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.SEND_INVOICE_TO)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.SEND_INVOICE_TO)}
            disabled={disabled || isLeaveBlank}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Department'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INVOICE_DEPT)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.INVOICE_DEPT)}
            disabled={disabled || isLeaveBlank}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'FA Email'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.SEND_INVOICE_TO_FA_EMAIL)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.SEND_INVOICE_TO_FA_EMAIL)}
            disabled={disabled || isLeaveBlank}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label={'Address (number, street, and apt. or suite no.)'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INVOICE_STREET_ADDRESS)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.INVOICE_STREET_ADDRESS)}
            disabled={disabled || isLeaveBlank}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Country'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INVOICE_COUNTRY)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.INVOICE_COUNTRY)}
            disabled={disabled || isLeaveBlank}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid container>
            <Grid item xs={6}>
              <InputMask
                label={'Zipcode'}
                errorMessage={_getErrorMessage(PO_FORM_KEY.INVOICE_ZIP)}
                placeholder={'Zip Code'}
                mask={'99999'}
                {...getFieldProps(PO_FORM_KEY.INVOICE_ZIP)}
                onChange={handleChangeZipCode}
                autoComplete="zip-code"
                disabled={disabled || isLeaveBlank}
                iconComponent={
                  isLoadingZipCode ? (
                    <LoadingCommon
                      size="small"
                      style={{
                        transform: 'scale(0.8) translateY(4px)',
                      }}
                    />
                  ) : null
                }
              />
            </Grid>
            <Grid item xs={1}>
              <Typography textAlign={'center'} mt={4}>
                -
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <InputMask
                label={'  '}
                errorMessage={_getErrorMessage(PO_FORM_KEY.INVOICE_ZIP4)}
                {...getFieldProps(PO_FORM_KEY.INVOICE_ZIP4)}
                min={1}
                mask={'9999'}
                disabled={disabled || isLeaveBlank}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Select
            options={statesOptions}
            label={'State'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INVOICE_STATE)}
            {...getFieldProps(PO_FORM_KEY.INVOICE_STATE)}
            onChange={setFieldValue}
            isDisabled={disabled || isLeaveBlank}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Input
            label={'City'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INVOICE_CITY)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.INVOICE_CITY)}
            disabled={disabled || isLeaveBlank}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

interface Props {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
}

export default React.memo(SendInvoiceInfo, (prevProps, nextProps) => {
  const prevFormikValues = prevProps.formikProps.values;
  const nextFormikValues = nextProps.formikProps.values;

  const formKeysNeedRender = [
    PO_FORM_KEY.SEND_INVOICE_TO,
    PO_FORM_KEY.SEND_INVOICE_TO_CLEAR_FLAG,
    PO_FORM_KEY.SEND_INVOICE_TO_FA_EMAIL,
    PO_FORM_KEY.INVOICE_DEPT,
    PO_FORM_KEY.INVOICE_STREET_ADDRESS,
    PO_FORM_KEY.INVOICE_CITY,
    PO_FORM_KEY.INVOICE_STATE,
    PO_FORM_KEY.INVOICE_ZIP,
    PO_FORM_KEY.INVOICE_ZIP4,
    PO_FORM_KEY.INVOICE_COUNTRY,
  ]; // only re-render if keys using in this component change

  return formKeysNeedRender.every((key) =>
    isEqualPrevAndNextObjByPath({
      prevValues: prevFormikValues,
      nextValues: nextFormikValues,
      path: key,
    })
  );
});
