import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import {
  Checkbox,
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  Input,
  RadioButton,
} from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps, UpsertPOFormValue } from '../types';
import { fedAttachmentOptions, FED_ATTACHMENT_VALUE, MAX_TAX_NUMBER } from './helpers';
import { PO_MODE } from 'src/queries';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/POPayment/types';

const PurchaseInfo = <T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps>({
  formikProps,
  disabled = false,
  currentPOMode,
}: Props<T>) => {
  const { values, errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } =
    formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleTaxTotalChange = (name, value) => {
    const taxTotalValue = value;
    // const subTotalValue = values.subtotal || 0;
    // const taxRateValue = (taxTotalValue / subTotalValue) * 100;
    // setFieldValue(PO_FORM_KEY.TAX_RATE, taxRateValue.toFixed(3));

    setFieldValue(name, taxTotalValue);
    setFieldValue(PO_FORM_KEY.TAX_RATE, '');
  };

  const handleTaxRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const subTotalValue = values.subtotal || 0;
    const taxRateValue = Number(event.target.value);
    const taxTotalValue = (Number(subTotalValue) * taxRateValue) / 100;

    setFieldValue(PO_FORM_KEY.TAX_RATE, taxRateValue);
    setFieldValue(PO_FORM_KEY.TAX_TOTAL, taxTotalValue);
  };

  // update taxTotal when subTotal change
  React.useEffect(() => {
    const subTotalValue = values.subtotal || 0;
    const taxRateValue = values.taxRate || 0;
    const taxTotalValue = (Number(subTotalValue) * Number(taxRateValue)) / 100;

    setFieldValue(PO_FORM_KEY.TAX_TOTAL, taxTotalValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFieldValue, values.subtotal]);

  // update totalValue when subTotal or taxTotal or shippingTotal change
  React.useEffect(() => {
    const subTotalValue = values.subtotal || 0;
    let taxTotalValue = 0;

    // if taxRate inputted => taxTotal can not over 10,000,000$
    if (!!values.taxRate) {
      taxTotalValue =
        !!values.taxTotal && Number(values.taxTotal) < MAX_TAX_NUMBER ? Number(values.taxTotal) : 0;
    } else {
      taxTotalValue = Number(values.taxTotal) || 0;
    }

    const shippingTotalValue = values.shippingTotal || 0;

    const totalValue = Number(subTotalValue) + Number(taxTotalValue) + Number(shippingTotalValue);
    setFieldValue(PO_FORM_KEY.TOTAL, totalValue);
  }, [setFieldValue, values.shippingTotal, values.subtotal, values.taxRate, values.taxTotal]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Box mb={2}>
          <Checkbox.Item
            label="Confirming Purchase Order (Do not duplicate this order. This P.O is a formal authorization for an order sent earlier.)"
            {...getFieldProps(PO_FORM_KEY.CONFIRMING)}
            errorMessage={_getErrorMessage(PO_FORM_KEY.CONFIRMING)}
            disabled={disabled}
          />
        </Box>
        <Box mb={2}>
          <Checkbox.Item
            label="RCUH considers this P.O. exempt from the Hawaii General Excise Tax."
            {...getFieldProps(PO_FORM_KEY.GET_EXEMPT)}
            errorMessage={_getErrorMessage(PO_FORM_KEY.GET_EXEMPT)}
            disabled={disabled}
          />
        </Box>
        <Box mb={2}>
          <Typography variant="h5">
            EXEMPTION OF PURCHASING FROM STATE OF HAWAII GENERAL EXCISE TAX
          </Typography>
          <Typography variant="body2">
            The Research Corporation of the University of Hawaii considers this purchase to be
            exempt from the payment of the State of Hawaii general excise tax in accordance with
            Section 237-26, HRS, as amended.
          </Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h5">
            This order is subject to the terms and conditions attached.
          </Typography>
        </Box>
        <Box mb={2}>
          <Checkbox.Item
            label="Attachment 31, General Terms and Conditions Applicable to All Purchase Orders"
            {...getFieldProps(PO_FORM_KEY.ATTACHMENT_31)}
            errorMessage={_getErrorMessage(PO_FORM_KEY.ATTACHMENT_31)}
            disabled={disabled}
          />
        </Box>
        <Box mb={2}>
          <RadioButton
            columns={1}
            options={[
              ...fedAttachmentOptions,
              {
                label: FED_ATTACHMENT_VALUE.UH_SUBAWARD,
                value: FED_ATTACHMENT_VALUE.UH_SUBAWARD,
                subLabel: (
                  <Box width={'30%'} ml={2}>
                    <Input
                      maxLength={10}
                      {...getUncontrolledFieldProps(PO_FORM_KEY.UH_SUBAWARD_NUMBER)}
                      errorMessage={_getErrorMessage(PO_FORM_KEY.UH_SUBAWARD_NUMBER)}
                      disabled={disabled}
                    />
                  </Box>
                ),
              },
            ]}
            {...getFieldProps(PO_FORM_KEY.FED_ATTACHMENT)}
            errorMessage={_getErrorMessage(PO_FORM_KEY.FED_ATTACHMENT)}
            onChange={setFieldValue}
            itemClassName="mb-except-last-16"
            disabled={disabled}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        <Grid container spacing={2}>
          <Grid item xs={8} className="justify-flex-end">
            <Typography variant="body2">Subtotal</Typography>
          </Grid>
          <Grid item xs={4}>
            <EllipsisTooltipInputCurrency
              {...getFieldProps(PO_FORM_KEY.SUBTOTAL)}
              disabled
              textAlign="right"
              lengthShowTooltip={14}
            />
          </Grid>
          <Grid item xs={3} className="justify-flex-end">
            <Typography variant="body2">Tax Rate (%)</Typography>
          </Grid>
          <Grid item xs={3}>
            <EllipsisTooltipInput
              {...getFieldProps(PO_FORM_KEY.TAX_RATE)}
              onChange={handleTaxRateChange}
              value={values.taxRate || ''}
              lengthShowTooltip={8}
              type="number"
              hideArrowTypeNumber
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={2} className="justify-flex-end">
            <Typography variant="body2">Tax</Typography>
          </Grid>
          <Grid item xs={4}>
            <EllipsisTooltipInputCurrency
              {...getFieldProps(PO_FORM_KEY.TAX_TOTAL)}
              onChange={handleTaxTotalChange}
              textAlign="right"
              lengthShowTooltip={14}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={8} className="justify-flex-end">
            <Typography textAlign="right" variant="body2">
              Estimated Shipping
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <EllipsisTooltipInputCurrency
              {...getFieldProps(PO_FORM_KEY.SHIPPING_TOTAL)}
              onChange={setFieldValue}
              textAlign="right"
              lengthShowTooltip={14}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={8} className="justify-flex-end">
            <Typography variant="body2" fontWeight={'bold'}>
              TOTAL
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <EllipsisTooltipInputCurrency
              {...getFieldProps(PO_FORM_KEY.TOTAL)}
              textAlign="right"
              disabled
              lengthShowTooltip={14}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

type Props<T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps> = {
  formikProps: T extends UpsertPOFormikProps ? UpsertPOFormikProps : UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default React.memo(PurchaseInfo, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_FORM_KEY.CONFIRMING,
    PO_FORM_KEY.GET_EXEMPT,
    PO_FORM_KEY.ATTACHMENT_31,
    PO_FORM_KEY.UH_SUBAWARD_NUMBER,
    PO_FORM_KEY.FED_ATTACHMENT,
    PO_FORM_KEY.SUBTOTAL,
    PO_FORM_KEY.TAX_RATE,
    PO_FORM_KEY.TAX_TOTAL,
    PO_FORM_KEY.SHIPPING_TOTAL,
    PO_FORM_KEY.TOTAL,
  ]; // only re-render if keys using in this component change

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    isEqualPrevAndNextFormikValues<UpsertPOFormValue | UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
