import { Grid, Typography } from '@mui/material';
import React from 'react';
import { Input } from 'src/components/common';
import { POAuthToPurchase } from 'src/queries/PurchaseOrders';
import { getErrorMessage } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_AUTH_TO_PURCHASE_KEY } from '../enum';

const FormCompleted: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;
  const _getErrorMessage = (fieldName: PO_AUTH_TO_PURCHASE_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <>
      <Typography variant="body2">Form Completed by</Typography>
      <Grid container>
        <Grid item xs={6}>
          <Input
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.FORM_COMPLETED_BY)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.FORM_COMPLETED_BY)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<POAuthToPurchase>;
  disabled: boolean;
};

export default React.memo(FormCompleted, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps.values.formCompletedBy;
  const nextFormikProps = nextProps.formikProps.values.formCompletedBy;

  return prevProps.disabled === nextProps.disabled && prevFormikProps === nextFormikProps;
});
