import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import {
  Element,
  EllipsisTooltipInput,
  Input,
  InputMask,
  InputUSPhone,
} from 'src/components/common';
import RequiredSign from 'src/containers/shared/RequiredSign';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { VENDOR_REGISTRATION_FORM_KEY } from '../enums';
import {
  isVendorRequiredEinNumber,
  isVendorRequiredRcuhNumber,
  isVendorRequiredTIN,
  isVendorRequiredUhNumber,
} from '../helpers';
import { VendorRegistrationFormikProps, VendorRegistrationFormValue } from '../types';

const AssigneeInfo: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { values, errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } =
    formikProps;

  const _getErrorMessage = (fieldName: VENDOR_REGISTRATION_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const selectedVendorClass = values.fedTaxClass;
  const isRequiredTINNumber = isVendorRequiredTIN(selectedVendorClass);
  const isRequiredRcuhNumber = isVendorRequiredRcuhNumber(selectedVendorClass);
  const isRequiredUhNumber = isVendorRequiredUhNumber(selectedVendorClass);
  const isRequiredEinNumber = isVendorRequiredEinNumber(selectedVendorClass);

  const disabledEIN = !!values.ssn || isRequiredRcuhNumber || isRequiredUhNumber;
  const disabledSSN =
    !!values.ein || isRequiredEinNumber || isRequiredRcuhNumber || isRequiredUhNumber;
  const disabledUHNumber =
    !!values.rcuhId || isRequiredTINNumber || isRequiredEinNumber || isRequiredRcuhNumber;
  const disabledRCUHNumber =
    !!values.uhId || isRequiredTINNumber || isRequiredEinNumber || isRequiredUhNumber;

  return (
    <Box>
      <Element
        errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.HAS_SSN_OR_EIN)}
        showErrorBorder
      >
        <Typography variant="h5" mb={2}>
          5. Enter the Taxpayer Identification Number (TIN) <RequiredSign />
        </Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={5.8}>
            <InputMask
              label="Social Security Number (SSN)"
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.SSN)}
              {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.SSN)}
              disabled={disabled || disabledSSN}
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
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.EIN)}
              {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.EIN)}
              disabled={disabled || disabledEIN}
              placeholder="XX-XXXXXXX"
              mask={'99-9999999'}
            />
          </Grid>
        </Grid>
      </Element>

      <Typography variant="h5" mb={2}>
        6. Enter the UH or RCUH Employee Number:
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={5.8}>
          <InputMask
            label="UH Employee Number"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.UH_ID)}
            {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.UH_ID)}
            disabled={disabled || disabledUHNumber}
            mask={'99999999'}
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
            label="RCUH Employee Number"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.RCUH_ID)}
            {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.RCUH_ID)}
            disabled={disabled || disabledRCUHNumber}
            mask={'999999'}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" mb={2}>
        7. This vendor registration form was completed by:
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label="Name"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.PREPARED_BY)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.PREPARED_BY)}
            disabled={disabled}
            maxLength={20}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputUSPhone
            label="Phone Number"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.PHONE_NUMBER)}
            {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.PHONE_NUMBER)}
            onChange={setFieldValue}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label="Email Address"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.EMAIL)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.EMAIL)}
            disabled={disabled}
            required
            maxLength={50}
            lengthShowTooltip={35}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label="Your Fiscal Administrator"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FA_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FA_NAME)}
            disabled={disabled}
            maxLength={20}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label="Your Fiscal Administrator's Email Address"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FA_EMAIL)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FA_EMAIL)}
            disabled={disabled}
            required
            maxLength={50}
            lengthShowTooltip={35}
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

  const formKeysNeedRender = [
    VENDOR_REGISTRATION_FORM_KEY.HAS_SSN_OR_EIN,
    VENDOR_REGISTRATION_FORM_KEY.SSN,
    VENDOR_REGISTRATION_FORM_KEY.EIN,
    VENDOR_REGISTRATION_FORM_KEY.UH_ID,
    VENDOR_REGISTRATION_FORM_KEY.RCUH_ID,
    VENDOR_REGISTRATION_FORM_KEY.PREPARED_BY,
    VENDOR_REGISTRATION_FORM_KEY.PHONE_NUMBER,
    VENDOR_REGISTRATION_FORM_KEY.EMAIL,
    VENDOR_REGISTRATION_FORM_KEY.FA_NAME,
    VENDOR_REGISTRATION_FORM_KEY.FA_EMAIL,
    VENDOR_REGISTRATION_FORM_KEY.FED_TAX_CLASS,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<VendorRegistrationFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
