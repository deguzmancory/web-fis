import { Grid, Typography } from '@mui/material';
import React from 'react';
import { Input } from 'src/components/common';
import { POAuthToPurchasePayload } from 'src/queries/PurchaseOrders';
import { getErrorMessage } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_AUTH_TO_PURCHASE_KEY } from '../enum';

const PurchaseInfo: React.FC<Props> = ({ formikProps }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;
  const _getErrorMessage = (fieldName: PO_AUTH_TO_PURCHASE_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>
        To be filled in and attached to all requisitions or purchase orders involving expenditure of
        federal funds for equipment with unit cost of $5,000 from grants.
      </Typography>
      <Grid item container spacing={2}>
        <Grid item xs={3.5}>
          <Input label={'RCUH Purchase Order No'} defaultValue="To be Assigned" disabled={true} />
        </Grid>
        <Grid item xs={3.5}>
          <Input
            maxLength={30}
            label={'Grant No'}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.GRANT_NUMBER)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.GRANT_NUMBER)}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            maxLength={30}
            label={'Contract No'}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.CONTRACT_NUMBER)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.CONTRACT_NUMBER)}
          />
        </Grid>
        <Grid item xs={2}>
          <Input
            maxLength={10}
            label={'Account No'}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.ACCOUNT_NUMBER)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.ACCOUNT_NUMBER)}
          />
        </Grid>
      </Grid>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<POAuthToPurchasePayload>;
};

export default React.memo(PurchaseInfo, (prevProps, nextProps) => {
  console.log('prevProps: ', prevProps);
  console.log('nextProps: ', nextProps);
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return false;
});
