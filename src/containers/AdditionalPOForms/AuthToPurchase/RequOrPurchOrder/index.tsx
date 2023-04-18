import { Grid, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'src/components/common';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/PO/types';
import { POAuthToPurchase } from 'src/queries/PurchaseOrders';
import { IRootState } from 'src/redux/rootReducer';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_AUTH_TO_PURCHASE_KEY } from '../enum';

const PurchaseInfo: React.FC<Props> = ({ formikProps, formData, disabled = false }) => {
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
          <Input label={'RCUH Purchase Order No'} value={formData?.number} disabled />
        </Grid>
        <Grid item xs={3.5}>
          <Input
            maxLength={30}
            label={'Grant No'}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.GRANT_NUMBER)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.GRANT_NUMBER)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            maxLength={30}
            label={'Contract No'}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.CONTRACT_NUMBER)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.CONTRACT_NUMBER)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={2}>
          <Input
            maxLength={10}
            label={'Account No'}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.ACCOUNT_NUMBER)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.ACCOUNT_NUMBER)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    formikProps: CommonFormikProps<POAuthToPurchase>;
    disabled: boolean;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(PurchaseInfo),
  (prevProps, nextProps) => {
    const prevFormikProps = prevProps.formikProps;
    const nextFormikProps = nextProps.formikProps;

    const formKeysNeedRender = [
      PO_AUTH_TO_PURCHASE_KEY.GRANT_NUMBER,
      PO_AUTH_TO_PURCHASE_KEY.CONTRACT_NUMBER,
      PO_AUTH_TO_PURCHASE_KEY.ACCOUNT_NUMBER,
    ];

    return (
      prevProps.disabled === nextProps.disabled &&
      isEqualPrevAndNextFormikValues<POAuthToPurchase>({
        prevFormikProps,
        nextFormikProps,
        formKeysNeedRender,
      })
    );
  }
);
