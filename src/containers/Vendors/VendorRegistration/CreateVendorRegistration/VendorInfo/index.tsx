import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { US_ZIP_CODE_LENGTH } from 'src/appConfig/constants';
import {
  Element,
  EllipsisTooltipInput,
  Input,
  InputMask,
  InputPhone,
  LoadingCommon,
  Select,
} from 'src/components/common';
import RequiredSign from 'src/containers/shared/RequiredSign';
import { useZipCode } from 'src/queries';
import { StateService } from 'src/services';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { VENDOR_REGISTRATION_FORM_KEY } from '../enums';
import { VendorRegistrationFormValue, VendorRegistrationFormikProps } from '../types';

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

  const disabledIndividualNameFields = !!values.company;
  const disabledCompanyNameFields =
    !!values.firstName || !!values.lastName || !!values.middleName || !!values.suffix;

  const _getErrorMessage = (fieldName: VENDOR_REGISTRATION_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const statesOptions = React.useMemo(() => {
    return StateService.getStates();
  }, []);

  // Zip Code
  const { checkZipCode, isLoading: isLoadingZipCode } = useZipCode({
    onSuccess(data) {
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_CITY, data.city);
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STATE, data.state);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_CITY, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STATE, false);
    },
  });

  const handleChangeZipCode = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    if (value?.length === US_ZIP_CODE_LENGTH) {
      checkZipCode(value);
    } else {
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_CITY, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STATE, '');
    }
    setFieldValue(field, value);
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        1. Enter the Name as shown on Line 1 of the vendor's W-9. For an employee vendor record, or
        an individual submitting a UH WH-1, GO TO #2.
      </Typography>

      <Input
        label="Taxpayer Name"
        errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.TAX_PAYER_NAME)}
        {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.TAX_PAYER_NAME)}
        disabled={disabled}
        maxLength={45}
        className={'mb-16'}
      />

      <Element
        errorMessage={_getErrorMessage(
          VENDOR_REGISTRATION_FORM_KEY.HAS_INDIVIDUAL_OR_BUSINESS_NAME
        )}
        showErrorBorder
      >
        <Typography variant="h5" mb={2}>
          2. Enter the Business Name/disregarded entity name as shown on Line 2 of the vendor's W-9.
          If Line 2 of the W-9 is blank, re-enter the Name from line 1. THE RCUH CHECK WILL BE MADE
          PAYABLE TO THE NAME BELOW. <RequiredSign />
        </Typography>

        <Typography variant="h5" mb={2}>
          Individual
        </Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={6} md={4}>
            <Input
              label="First Name"
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
              {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
              disabled={disabled || disabledIndividualNameFields}
              maxLength={20}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <Input
              label="Last Name"
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.LAST_NAME)}
              {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.LAST_NAME)}
              disabled={disabled || disabledIndividualNameFields}
              maxLength={20}
            />
          </Grid>
          <Grid item xs={12} md={4} container spacing={2}>
            <Grid item xs={5}>
              <Input
                label="MI"
                maxLength={5}
                infoToolTipWithArrow
                infoTooltipMessage="Middle Initial"
                infoTooltipPlacement="right-end"
                errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.MIDDLE_NAME)}
                {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.MIDDLE_NAME)}
                disabled={disabled || disabledIndividualNameFields}
              />
            </Grid>
            <Grid item xs={7}>
              <Input
                label="Suffix (e.g., Jr, Sr, II, etc.)"
                errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.SUFFIX)}
                {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.SUFFIX)}
                disabled={disabled || disabledIndividualNameFields}
                maxLength={5}
              />
            </Grid>
          </Grid>
        </Grid>

        <Typography style={{ display: 'contents' }}>
          Or{' '}
          <Typography style={{ display: 'contents' }} variant="body1" fontWeight="bold">
            Business/Trade name
          </Typography>
        </Typography>
        <Input
          label=""
          errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.COMPANY)}
          {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.COMPANY)}
          disabled={disabled || disabledCompanyNameFields}
          maxLength={45}
        />
      </Element>

      <Typography variant="h5" my={2}>
        3. Enter the vendor’s address (only a U.S. address is allowed).
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Input
            label={'Department/Office'}
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.DEPARTMENT_OR_OFFICE)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.DEPARTMENT_OR_OFFICE)}
            disabled={disabled}
            maxLength={45}
          />
        </Grid>
        <Grid item xs={8}>
          <EllipsisTooltipInput
            label={'Address (Number, Street, and Apt/Suite/Room No.)'}
            required
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STREET)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STREET)}
            disabled={disabled}
            lengthShowTooltip={40}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Input
            label={'City'}
            required
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_CITY)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_CITY)}
            disabled={disabled}
            maxLength={30}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Select
            options={statesOptions}
            label={'State'}
            required
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STATE)}
            {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STATE)}
            onBlur={setFieldTouched}
            onChange={setFieldValue}
            isDisabled={disabled}
          />
        </Grid>
        <Grid item container xs={12} sm={6} md={4}>
          <Grid item xs={7}>
            <InputMask
              label={'Zipcode'}
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_ZIP)}
              placeholder={'Zip Code'}
              mask={'99999'}
              required
              {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_ZIP)}
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
              errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_ZIP4)}
              {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.ADDRESS_ZIP4)}
              min={1}
              mask={'9999'}
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InputPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(
              VENDOR_REGISTRATION_FORM_KEY.VENDOR_ADDRESS_PHONE_NUMBER
            )}
            {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.VENDOR_ADDRESS_PHONE_NUMBER)}
            onChange={setFieldValue}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <EllipsisTooltipInput
            label={'Email Address'}
            errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.VENDOR_ADDRESS_EMAIL)}
            {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.VENDOR_ADDRESS_EMAIL)}
            disabled={disabled}
            lengthShowTooltip={40}
            maxLength={50}
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

  const formKeysNeedRender = [
    VENDOR_REGISTRATION_FORM_KEY.TAX_PAYER_NAME,
    VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME,
    VENDOR_REGISTRATION_FORM_KEY.LAST_NAME,
    VENDOR_REGISTRATION_FORM_KEY.MIDDLE_NAME,
    VENDOR_REGISTRATION_FORM_KEY.SUFFIX,
    VENDOR_REGISTRATION_FORM_KEY.COMPANY,
    VENDOR_REGISTRATION_FORM_KEY.DEPARTMENT_OR_OFFICE,
    VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STREET,
    VENDOR_REGISTRATION_FORM_KEY.ADDRESS_CITY,
    VENDOR_REGISTRATION_FORM_KEY.ADDRESS_STATE,
    VENDOR_REGISTRATION_FORM_KEY.ADDRESS_ZIP,
    VENDOR_REGISTRATION_FORM_KEY.ADDRESS_ZIP4,
    VENDOR_REGISTRATION_FORM_KEY.VENDOR_ADDRESS_PHONE_NUMBER,
    VENDOR_REGISTRATION_FORM_KEY.VENDOR_ADDRESS_EMAIL,

    VENDOR_REGISTRATION_FORM_KEY.HAS_INDIVIDUAL_OR_BUSINESS_NAME,
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
