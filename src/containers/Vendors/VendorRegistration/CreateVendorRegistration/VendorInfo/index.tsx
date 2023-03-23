import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { US_ZIP_CODE_LENGTH } from 'src/appConfig/constants';
import {
  EllipsisTooltipInput,
  InputMask,
  InputPhone,
  LoadingCommon,
  Select,
} from 'src/components/common';
import { useZipCode } from 'src/queries';
import { StateService } from 'src/services';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { VENDOR_REGISTRATION_FORM_KEY } from '../enums';
import { VendorRegistrationFormikProps, VendorRegistrationFormValue } from '../types';

const VendorInfo: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const _getErrorMessage = (fieldName: VENDOR_REGISTRATION_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const statesOptions = React.useMemo(() => {
    return StateService.getStates();
  }, []);

  // Zip Code
  const { checkZipCode, isLoading: isLoadingZipCode } = useZipCode({
    onSuccess(data) {
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.CITY, data.city);
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.STATE, data.state);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.CITY, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.STATE, false);
    },
  });

  const handleChangeZipCode = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    if (value?.length === US_ZIP_CODE_LENGTH) {
      checkZipCode(value);
    } else {
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.CITY, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.STATE, '');
    }
    setFieldValue(field, value);
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        1. Enter the Name as shown on Line 1 of the vendor's W-9. For an employee vendor record, or
        an individual submitting a UH WH-1, GO TO #2.
      </Typography>

      <EllipsisTooltipInput
        label="Taxpayer Name"
        errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
        {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
        disabled={disabled}
      />

      <Typography variant="h5" my={2}>
        2. Enter the Business Name/disregarded entity name as shown on Line 2 of the vendor's W-9.
        If Line 2 of the W-9 is blank, re-enter the Name from line 1. THE RCUH CHECK WILL BE MADE
        PAYABLE TO THE NAME BELOW. *
      </Typography>

      <Typography variant="h5" mb={2}>
        Individual
      </Typography>

      <Grid container spacing={3} mb={2}>
        <Grid item xs={6} md={4}>
          <EllipsisTooltipInput
            label="First Name"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <EllipsisTooltipInput
            label="Last Name"
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={4} container spacing={3}>
          <Grid item xs={5}>
            <EllipsisTooltipInput
              label="MI"
              maxLength={5}
              infoToolTipWithArrow
              infoTooltipMessage="Middle Initial"
              infoTooltipPlacement="right-end"
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
              {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={7}>
            <EllipsisTooltipInput
              label="Suffix (e.g., Jr, Sr, II, etc.)"
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
              {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>

      <EllipsisTooltipInput
        label={
          <>
            Or <b>Business/Trade name</b>
          </>
        }
      />

      <Typography variant="h5" my={2}>
        3. Enter the vendor’s address (only a U.S. address is allowed).
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <EllipsisTooltipInput
            label={'Department/Office'}
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={8}>
          <EllipsisTooltipInput
            label={'Address (Number, Street, and Apt/Suite/Room No.)'}
            required
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label={'City'}
            required
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.CITY)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.CITY)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Select
            options={statesOptions}
            label={'State'}
            required
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.STATE)}
            {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.STATE)}
            onChange={setFieldValue}
            isDisabled={disabled}
          />
        </Grid>
        <Grid item container xs={12} sm={6} md={4}>
          <Grid item xs={7}>
            <InputMask
              label={'Zipcode'}
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.ZIP)}
              placeholder={'Zip Code'}
              mask={'99999'}
              required
              {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.ZIP)}
              onChange={handleChangeZipCode}
              autoComplete="zip-code"
              disabled={disabled}
              iconComponent={
                isLoadingZipCode ? (
                  <LoadingCommon
                    size="small"
                    style={{
                      transform: 'scale(0.8) translateY(4px)',
                    }}
                  />
                ) : null
              }
            />
          </Grid>
          <Grid item xs={1}>
            <Typography textAlign={'center'} mt={4}>
              -
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <InputMask
              label={' '}
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.ZIP4)}
              {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.ZIP4)}
              min={1}
              mask={'9999'}
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label={'Email Address'}
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
            disabled={disabled}
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

export default React.memo(VendorInfo, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME];

  return isEqualPrevAndNextFormikValues<VendorRegistrationFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
