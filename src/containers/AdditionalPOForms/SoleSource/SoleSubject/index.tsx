import { Box, Grid, Typography } from '@mui/material';
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
import { POSoleSource } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_SOLE_SOURCE_FORM_KEY } from '../enum';
import { PO_CERTIFICATE_KEY } from '../../shared/Certification/enum';

const SoleSourceSubject: React.FC<Props> = ({ formikProps, formData, disabled }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const _getErrorMessage = (fieldName: PO_SOLE_SOURCE_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <EllipsisTooltipInput
            label={'To'}
            maxLength={250}
            lengthShowTooltip={70}
            placeholder={'Name of Designated University Official or Fiscal Administrator'}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.TO)}
            {...getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.TO)}
            disabled={disabled}
            onChange={(event) => {
              setFieldValue(
                PO_CERTIFICATE_KEY.APPROVED_DUO,
                (event.target as HTMLInputElement)?.value
              );
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <DatePicker
            label="Date"
            {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.SS_DATE)}
            name={PO_SOLE_SOURCE_FORM_KEY.SS_DATE}
            placeholder={'MM/DD/YYYY'}
            selected={values.ssDate as Date}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.SS_DATE)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={8}>
          <EllipsisTooltipInput
            label={'From'}
            maxLength={250}
            lengthShowTooltip={70}
            placeholder={'Name of Principal Investigator, Department Head, or Administrator'}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.FROM)}
            {...getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.FROM)}
            disabled={disabled}
            onChange={(event) => {
              setFieldValue(
                PO_CERTIFICATE_KEY.DEPARTMENT_HEAD,
                (event.target as HTMLInputElement)?.value
              );
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <InputPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.PHONE)}
            {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.PHONE)}
            onChange={setFieldValue}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <EllipsisTooltipInput
            label={'Department'}
            maxLength={500}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT)}
            {...getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT)}
            disabled={disabled}
          />
        </Grid>
        <Grid item>
          <Typography variant="h5">Subject: Sole Source Justification</Typography>
        </Grid>
        <Grid item xs={12}>
          <Input label={'Contractor/Subcontractor/Vendor'} disabled />
        </Grid>
        <Grid item xs={12}>
          <Input label={'Description'} defaultValue={'See Purchase Requisition'} disabled />
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

        <Grid item xs={12}>
          <Input
            label={'Prior Sole Source Reference Numbers, if any'}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.PRIOR_REFERENCE_NUMBER)}
            {...getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.PRIOR_REFERENCE_NUMBER)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    formikProps: CommonFormikProps<POSoleSource>;
    disabled: boolean;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SoleSourceSubject),
  (prevProps, nextProps) => {
    const prevFormikProps = prevProps.formikProps;
    const nextFormikProps = nextProps.formikProps;

    const formKeysNeedRender = [
      PO_SOLE_SOURCE_FORM_KEY.TO,
      PO_SOLE_SOURCE_FORM_KEY.SS_DATE,
      PO_SOLE_SOURCE_FORM_KEY.FROM,
      PO_SOLE_SOURCE_FORM_KEY.PHONE,
      PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT,
      PO_SOLE_SOURCE_FORM_KEY.PRIOR_REFERENCE_NUMBER,
    ];

    return (
      prevProps.disabled === nextProps.disabled &&
      isEqualPrevAndNextFormikValues<POSoleSource>({
        prevFormikProps,
        nextFormikProps,
        formKeysNeedRender,
      })
    );
  }
);
