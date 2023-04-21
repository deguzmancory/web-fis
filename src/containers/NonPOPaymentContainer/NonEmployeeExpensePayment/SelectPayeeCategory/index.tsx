import { Box, Divider, Grid, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { Input, RadioButton } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { NON_EMPLOYEE_TRAVEL_FORM_KEY } from '../enums';
import { UpsertNonEmployeeTravelFormikProps } from '../types';
import { payeeCategoryOptions1, payeeCategoryOptions2 } from './helpers';
import { PO_MODE } from 'src/queries';

const SelectPayeeCategory: FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName: NON_EMPLOYEE_TRAVEL_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Login Name'}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.LOGIN_NAME)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.LOGIN_NAME)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Date'}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.DATE)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.DATE)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'Payment Req. No.'}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.REQUEST_NUMBER)}
            {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.REQUEST_NUMBER)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <RadioButton
            label={<b>Payee Category</b>}
            options={payeeCategoryOptions1}
            {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.PAYEE_CATEGORY)}
            disabled={disabled}
            required
            onChange={setFieldValue}
            columns={1}
          />
        </Grid>
        <Grid item xs={12} md={8} className="justify-center">
          <Typography variant="body2">
            Category (1) Payee: Independent Contractors and subawardees must claim business expenses
            through their service or subaward agreement, not this form. Refer to Policy 2.008 Tax
            Treatment of Business Expenses (Service-Related).
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <RadioButton
            options={payeeCategoryOptions2}
            errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.PAYEE_CATEGORY)}
            {...getFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.PAYEE_CATEGORY)}
            disabled={disabled}
            required
            onChange={setFieldValue}
            columns={1}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="body2">
            Category (2) Payee: Use this form to claim non-service expenses. Refer to Policy 2.006
            Tax Treatment of Non-Service Financial Assistance, for Individuals (NSFA).
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertNonEmployeeTravelFormikProps;
  disabled?: boolean;
  currentMode: PO_MODE;
};

export default memo(SelectPayeeCategory, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    NON_EMPLOYEE_TRAVEL_FORM_KEY.LOGIN_NAME,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.DATE,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.REQUEST_NUMBER,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.PAYEE_CATEGORY,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentMode === nextProps.currentMode &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
