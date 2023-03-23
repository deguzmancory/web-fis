import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { EllipsisTooltipInput, InputMask, InputPhone } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { VENDOR_REGISTRATION_FORM_KEY } from '../enums';
import { VendorRegistrationFormikProps, VendorRegistrationFormValue } from '../types';

const AssigneeInfo: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { values, errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } =
    formikProps;

  const _getErrorMessage = (fieldName: VENDOR_REGISTRATION_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        5. Enter the Taxpayer Identification Number (TIN) *
      </Typography>

      <Grid container spacing={3} mb={2}>
        <Grid item xs={5.8}>
          <InputMask
            label="Social Security Number (SSN)"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            mask={'999-99-9999'}
            placeholder="XXX-XX-XXXX"
          />
        </Grid>
        <Grid
          item
          xs={0.4}
          sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: '2px' }}
        >
          <Typography>OR</Typography>
        </Grid>
        <Grid item xs={5.8}>
          <InputMask
            label="Employer Identification Number (EIN)"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            placeholder="XX - XXXXX"
            mask={'99 - 99999'}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" mb={2}>
        6. Enter the UH or RCUH Employee Number:
      </Typography>

      <Grid container spacing={3} mb={2}>
        <Grid item xs={5.8}>
          <EllipsisTooltipInput
            label="UH Employee Number"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid
          item
          xs={0.4}
          sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: '2px' }}
        >
          <Typography>OR</Typography>
        </Grid>
        <Grid item xs={5.8}>
          <EllipsisTooltipInput
            label="RCUH Employee Number"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            required
          />
        </Grid>
      </Grid>

      <Typography variant="h5" mb={2}>
        7. This vendor registration form was completed by:
      </Typography>

      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label="Name"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputPhone
            label="Phone Number"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label="Email Address"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label="Your Fiscal Administrator"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label="Your Fiscal Administrator's Email Address"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: VendorRegistrationFormikProps;
  disabled?: boolean;
};

export default React.memo(AssigneeInfo, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME];

  return isEqualPrevAndNextFormikValues<VendorRegistrationFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
