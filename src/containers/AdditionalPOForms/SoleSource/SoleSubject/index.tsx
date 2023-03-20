import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import {
  DatePicker,
  EllipsisTooltipInput,
  InputPhone,
  Input,
  InputCurrency,
} from 'src/components/common';
import dayjs from 'dayjs';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { POSoleSourcePayload } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_SOLE_SOURCE_FORM_KEY } from '../enum';

const SoleSourceSubject: React.FC<Props> = ({ formikProps, formData }) => {
  const {
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
          />
        </Grid>
        <Grid item xs={4}>
          <DatePicker
            label="Date"
            {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.SS_DATE)}
            name={PO_SOLE_SOURCE_FORM_KEY.SS_DATE}
            placeholder={'MM/DD/YYYY'}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            value={dayjs(new Date().toISOString()).format('DD/MM/YYYY')}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.SS_DATE)}
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
          />
        </Grid>
        <Grid item xs={4}>
          <InputPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.PHONE)}
            {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.PHONE)}
            onChange={setFieldValue}
          />
        </Grid>
        <Grid item xs={12}>
          <EllipsisTooltipInput
            label={'Department'}
            maxLength={500}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT)}
            {...getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT)}
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
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    formikProps: CommonFormikProps<POSoleSourcePayload>;
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

    return isEqualPrevAndNextFormikValues<POSoleSourcePayload>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    });
  }
);
