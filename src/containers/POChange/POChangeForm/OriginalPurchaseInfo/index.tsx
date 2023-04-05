import { Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { EllipsisTooltipInput, EllipsisTooltipInputCurrency } from 'src/components/common';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/enums';
import {
  UpsertPOFormValue,
  UpsertPOFormikProps,
} from 'src/containers/PurchaseOrderContainer/types';
import { isEqualPrevAndNextFormikValues } from 'src/utils';

const OriginalPurchaseInfo: React.FC<Props> = ({ formikProps }) => {
  const { values, getFieldProps, setFieldValue } = formikProps;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <></>
      </Grid>
      <Grid item xs={12} md={5}>
        <Grid container spacing={2}>
          <Grid item xs={8} className="justify-flex-end">
            <Typography variant="body2">Subtotal</Typography>
          </Grid>
          <Grid item xs={4}>
            <EllipsisTooltipInputCurrency
              {...getFieldProps(PO_FORM_KEY.ORIGINAL_SUBTOTAL)}
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
              {...getFieldProps(PO_FORM_KEY.ORIGINAL_TAX_RATE)}
              value={values.taxRate || ''}
              lengthShowTooltip={8}
              type="number"
              hideArrowTypeNumber
              disabled
            />
          </Grid>
          <Grid item xs={2} className="justify-flex-end">
            <Typography variant="body2">Tax</Typography>
          </Grid>
          <Grid item xs={4}>
            <EllipsisTooltipInputCurrency
              {...getFieldProps(PO_FORM_KEY.ORIGINAL_TAX_TOTAL)}
              textAlign="right"
              lengthShowTooltip={14}
              disabled
            />
          </Grid>
          <Grid item xs={8} className="justify-flex-end">
            <Typography textAlign="right" variant="body2">
              Estimated Shipping
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <EllipsisTooltipInputCurrency
              {...getFieldProps(PO_FORM_KEY.ORIGINAL_SHIPPING_TOTAL)}
              onChange={setFieldValue}
              textAlign="right"
              lengthShowTooltip={14}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={8} className="justify-flex-end">
            <Typography variant="body2" fontWeight={'bold'}>
              ORIGINAL TOTAL
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <EllipsisTooltipInputCurrency
              {...getFieldProps(PO_FORM_KEY.ORIGINAL_TOTAL)}
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
}

export default React.memo(OriginalPurchaseInfo, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_FORM_KEY.ORIGINAL_SHIPPING_TOTAL,
    PO_FORM_KEY.ORIGINAL_SUBTOTAL,
    PO_FORM_KEY.ORIGINAL_TAX_TOTAL,
    PO_FORM_KEY.ORIGINAL_TOTAL,
    PO_FORM_KEY.ORIGINAL_TAX_RATE,
  ]; // only re-render if keys using in this component change

  return isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
