import { Grid, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import {
  DatePicker,
  EllipsisTooltipInput,
  Input,
  InputCurrency,
  InputPhone,
} from 'src/components/common';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { PODeterminationPayload } from 'src/queries/PurchaseOrders';
import { IRootState } from 'src/redux/rootReducer';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_DETERMINATION_KEY } from '../enum';

const SubjectDetermination: React.FC<Props> = ({ formikProps, formData, disabled = false }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const _getErrorMessage = (fieldName: PO_DETERMINATION_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <EllipsisTooltipInput
            label={'To'}
            maxLength={250}
            placeholder={'Name of Designated University Official or Fiscal Administrator'}
            errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.TO)}
            {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.TO)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={4}>
          <DatePicker
            label="Date"
            {...getFieldProps(PO_DETERMINATION_KEY.D_DATE)}
            name={PO_DETERMINATION_KEY.D_DATE}
            selected={values.dDate as Date}
            placeholder={'MM/DD/YYYY'}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.D_DATE)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={8}>
          <EllipsisTooltipInput
            label={'From'}
            maxLength={250}
            placeholder={'Name of Principal Investigator, Department Head, or Administrator'}
            errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.FROM)}
            {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.FROM)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={4}>
          <InputPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.PHONE)}
            {...getFieldProps(PO_DETERMINATION_KEY.PHONE)}
            onChange={setFieldValue}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <EllipsisTooltipInput
            label={'Department'}
            maxLength={500}
            errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.DEPARTMENT)}
            {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.DEPARTMENT)}
            disabled={disabled}
          />
        </Grid>
        <Grid item>
          <Typography variant="h5">
            Subject: Determination of Cost or Price Reasonableness
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Input
            label={'Good or Service to be Acquired'}
            defaultValue={'See Purchase Requisition'}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Input label={'Vendor'} disabled />
        </Grid>
        <Grid item xs={6}>
          <InputCurrency
            label={'Amount (attach written quotation)'}
            value={formData?.total}
            name=""
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <Input label={'Purchase Order Number'} value={formData?.number} name="" disabled />
        </Grid>
      </Grid>
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    formikProps: CommonFormikProps<PODeterminationPayload>;
    disabled: boolean;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SubjectDetermination),
  (prevProps, nextProps) => {
    const prevFormikProps = prevProps.formikProps;
    const nextFormikProps = nextProps.formikProps;

    const formKeysNeedRender = [
      PO_DETERMINATION_KEY.TO,
      PO_DETERMINATION_KEY.D_DATE,
      PO_DETERMINATION_KEY.FROM,
      PO_DETERMINATION_KEY.PHONE,
      PO_DETERMINATION_KEY.DEPARTMENT,
    ];

    return (
      prevProps.disabled === nextProps.disabled &&
      isEqualPrevAndNextFormikValues<PODeterminationPayload>({
        prevFormikProps,
        nextFormikProps,
        formKeysNeedRender,
      })
    );
  }
);
