import { Box, Divider, Grid, Typography } from '@mui/material';
import { FC, useEffect, memo, ChangeEvent } from 'react';
import {
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  Input,
  TextareaAutosize,
} from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { FED_ATTACHMENT_VALUE, MAX_TAX_NUMBER } from './helpers';

import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/PO/enums';
import {
  UpsertPOFormValue,
  UpsertPOFormikProps,
} from 'src/containers/PurchaseOrderContainer/PO/types';
import { PO_MODE } from 'src/queries';
import { getTypeOfPOChange } from '../helpers';
import { isPOChangeTotalCancellationForm } from 'src/queries/POChange/helpers';

const PurchaseInfoChange: FC<Props> = ({
  formikProps,
  disabled = false,
  allowUpdateAmount = true,
  showAmountChangeSection = false,
}) => {
  const { values, errors, touched, getFieldProps, setFieldValue, getUncontrolledFieldProps } =
    formikProps;

  const isTotalCancellationForm = isPOChangeTotalCancellationForm(values.formNumber);

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleTaxTotalChange = (name, value) => {
    const taxTotalValue = value;

    setFieldValue(name, taxTotalValue);
    setFieldValue(PO_FORM_KEY.TAX_RATE, '');
  };

  const handleTaxRateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const subTotalValue = values.subtotal || 0;
    const taxRateValue = Number(event.target.value);
    const taxTotalValue = (Number(subTotalValue) * taxRateValue) / 100;

    setFieldValue(PO_FORM_KEY.TAX_RATE, taxRateValue);
    setFieldValue(PO_FORM_KEY.TAX_TOTAL, taxTotalValue);
  };

  // update taxTotal when subTotal change
  useEffect(() => {
    const subTotalValue = values.subtotal || 0;
    const taxRateValue = values.taxRate || 0;
    const taxTotalValue = (Number(subTotalValue) * Number(taxRateValue)) / 100;

    setFieldValue(PO_FORM_KEY.TAX_TOTAL, taxTotalValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFieldValue, values.subtotal]);

  // update totalValue when subTotal or taxTotal or shippingTotal change
  useEffect(() => {
    let taxTotalValue = 0;
    const subTotalValue = values.subtotal || 0;
    const originalTotal = values.originalTotal;

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
    setFieldValue(PO_FORM_KEY.AMOUNT_CHANGE, Math.abs(totalValue - Number(originalTotal)));
  }, [
    setFieldValue,
    values.originalTotal,
    values.shippingTotal,
    values.subtotal,
    values.taxRate,
    values.taxTotal,
  ]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>Type of Change:</b> {getTypeOfPOChange(values.formNumber)}
        </Typography>
      </Grid>

      {values.fedAttachment === FED_ATTACHMENT_VALUE.UH_SUBAWARD && (
        <Grid item xs={12}>
          <Box width={'25%'}>
            <Input
              label={'UH Subaward'}
              maxLength={10}
              {...getUncontrolledFieldProps(PO_FORM_KEY.UH_SUBAWARD_NUMBER)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.UH_SUBAWARD_NUMBER)}
              disabled={disabled}
            />
          </Box>
        </Grid>
      )}

      <Grid item xs={12} md={7}>
        <Grid item xs={11} container spacing={2}>
          <Grid item xs={12}>
            <TextareaAutosize
              label={isTotalCancellationForm ? 'Reason for Cancellation' : 'Reason for Change'}
              minRows={3}
              {...getUncontrolledFieldProps(PO_FORM_KEY.REASON_FOR_CHANGE)}
              errorMessage={_getErrorMessage(PO_FORM_KEY.REASON_FOR_CHANGE)}
              disabled={disabled}
            />
          </Grid>
          {showAmountChangeSection && (
            <Grid item container xs={12} spacing={2}>
              <Grid item xs={2.5}>
                <Typography variant="body2">Amount Change:</Typography>
              </Grid>
              <Grid item xs={3}>
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(PO_FORM_KEY.AMOUNT_CHANGE)}
                  lengthShowTooltip={14}
                  disabled
                />
              </Grid>
              <Grid item xs={3.5}>
                <Typography variant="body2">Remaining Balance on P.O. after this change</Typography>
              </Grid>
              <Grid item xs={3}>
                <EllipsisTooltipInputCurrency
                  {...getFieldProps(PO_FORM_KEY.BALANCE)}
                  lengthShowTooltip={14}
                  disabled
                />
              </Grid>
            </Grid>
          )}
        </Grid>
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
              disabled={disabled || !allowUpdateAmount}
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
              disabled={disabled || !allowUpdateAmount}
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
              disabled={disabled || !allowUpdateAmount}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={8} className="justify-flex-end">
            <Typography variant="body2" fontWeight={'bold'}>
              {showAmountChangeSection ? 'NEW TOTAL' : 'TOTAL'}
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

interface Props {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
  allowUpdateAmount: boolean;
  showAmountChangeSection: boolean;
}

export default memo(PurchaseInfoChange, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_FORM_KEY.SUBTOTAL,
    PO_FORM_KEY.TAX_RATE,
    PO_FORM_KEY.SUPER_QUOTE_NUMBER,
    PO_FORM_KEY.TAX_TOTAL,
    PO_FORM_KEY.SHIPPING_TOTAL,
    PO_FORM_KEY.TOTAL,
    PO_FORM_KEY.UH_SUBAWARD_NUMBER,
    PO_FORM_KEY.FED_ATTACHMENT,
  ]; // only re-render if keys using in this component change

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentPOMode === nextProps.currentPOMode &&
    prevProps.allowUpdateAmount === nextProps.allowUpdateAmount &&
    prevProps.showAmountChangeSection === nextProps.showAmountChangeSection &&
    isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
