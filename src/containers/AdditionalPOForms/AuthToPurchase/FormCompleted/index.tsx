import { Grid, Typography } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import { Input } from 'src/components/common';
import { POAuthToPurchasePayload } from 'src/queries/PurchaseOrders';
import { getErrorMessage } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_AUTH_TO_PURCHASE_KEY } from '../enum';

const FormCompleted: React.FC<Props> = ({ formikProps }) => {
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
          />
        </Grid>
      </Grid>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<POAuthToPurchasePayload>;
};

export default React.memo(FormCompleted, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps.values.formCompletedBy;
  const nextFormikProps = nextProps.formikProps.values.formCompletedBy;

  return isEqual(prevFormikProps, nextFormikProps);
});
