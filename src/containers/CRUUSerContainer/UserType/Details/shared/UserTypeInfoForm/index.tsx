import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import {
  Accordion,
  Input,
  InputMask,
  InputPhone,
  LoadingCommon,
  Select,
} from 'src/components/common';
import { CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps, getErrorMessage } from 'src/containers/CRUUSerContainer/helper';
import { useZipCode } from 'src/queries';
import { StateService } from 'src/services';

const usZipCodeLength = 5;

const UserTypeInfoForm: React.FC<Props> = ({
  title = '',
  prefix = '',
  showGeneralInfoSection = true,
  showShipInfoSection = true,
  showRemittanceInfoSection = true,
  formikProps,
  isLoading,
}) => {
  const {
    errors,
    touched,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
    getUncontrolledFieldProps,
  } = formikProps;
  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  // Zip Code
  const { checkZipCode, isLoading: isLoadingZipCode } = useZipCode({
    onSuccess(data) {
      setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_CITY}`, data.city);
      setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_STATE}`, data.state);
      setFieldTouched(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_CITY}`, false);
      setFieldTouched(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_STATE}`, false);
    },
    onError(error, variables, context) {},
  });

  const handleChangeZipCode = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    if (value?.length === usZipCodeLength) {
      checkZipCode(value);
    } else {
      setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_CITY}`, '');
      setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_STATE}`, '');
    }
    setFieldValue(field, value);
  };

  const statesOptions = React.useMemo(() => {
    return StateService.getStates();
  }, []);

  return (
    <Accordion title={title}>
      {/* Section General Info */}
      {showGeneralInfoSection && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Input
                label={'Direct Inquiries on This Order To'}
                errorMessage={_getErrorMessage(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.DIRECT_INQUIRIES_TO}`
                )}
                {...getUncontrolledFieldProps(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.DIRECT_INQUIRIES_TO}`
                )}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputPhone
                label={'Phone Number'}
                errorMessage={_getErrorMessage(`${prefix}.${CRUUSER_USER_TYPE_KEY.PHONE_NUMBER}`)}
                {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.PHONE_NUMBER}`)}
                onChange={setFieldValue}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Input
                label={'FA Staff to Review'}
                errorMessage={_getErrorMessage(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.FA_STAFF_TO_REVIEW}`
                )}
                {...getUncontrolledFieldProps(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.FA_STAFF_TO_REVIEW}`
                )}
                disabled={isLoading}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Section Default Ship To Information */}
      {showShipInfoSection && (
        <Box my={3}>
          <Typography variant="h5" mb={1}>
            Default Ship To Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Input
                label={'Name'}
                errorMessage={_getErrorMessage(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.SEND_INVOICE_TO}`
                )}
                {...getUncontrolledFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.SEND_INVOICE_TO}`)}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Input
                label={'Department'}
                errorMessage={_getErrorMessage(`${prefix}.${CRUUSER_USER_TYPE_KEY.DEPARTMENT}`)}
                {...getUncontrolledFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.DEPARTMENT}`)}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Input
                label={'FA Email'}
                errorMessage={_getErrorMessage(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.SEND_INVOICE_TO_EMAIL}`
                )}
                {...getUncontrolledFieldProps(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.SEND_INVOICE_TO_EMAIL}`
                )}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label={'Address (number, street, and apt. or suite no.)'}
                errorMessage={_getErrorMessage(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_STREET}`)}
                {...getUncontrolledFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_STREET}`)}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Input
                label={'Country'}
                errorMessage={_getErrorMessage(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_COUNTRY}`
                )}
                {...getUncontrolledFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_COUNTRY}`)}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Grid container>
                <Grid item xs={6}>
                  <InputMask
                    label={'Zipcode'}
                    errorMessage={_getErrorMessage(
                      `${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_ZIP}`
                    )}
                    placeholder={'Zip Code'}
                    mask={'99999'}
                    {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_ZIP}`)}
                    onChange={handleChangeZipCode}
                    autoComplete="asdasdasd"
                    disabled={isLoading}
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
                <Grid item xs={5}>
                  <InputMask
                    label={'  '}
                    errorMessage={_getErrorMessage(
                      `${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_ZIP_4}`
                    )}
                    {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_ZIP_4}`)}
                    min={1}
                    mask={'9999'}
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Select
                options={statesOptions}
                label={'State'}
                errorMessage={_getErrorMessage(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_STATE}`)}
                {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_STATE}`)}
                onChange={setFieldValue}
                isDisabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Input
                label={'City'}
                errorMessage={_getErrorMessage(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_CITY}`)}
                {...getUncontrolledFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.ADDRESS_CITY}`)}
                disabled={isLoading}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      {/* Section Default Remittance Information */}
      {showRemittanceInfoSection && (
        <Box>
          <Typography variant="h5" mb={1}>
            Default Remittance Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Input
                label={'Remittance Advice Name'}
                errorMessage={_getErrorMessage(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.REMITTANCE_NAME}`
                )}
                {...getUncontrolledFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.REMITTANCE_NAME}`)}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputPhone
                label={'Remittance Advice Phone Number'}
                errorMessage={_getErrorMessage(
                  `${prefix}.${CRUUSER_USER_TYPE_KEY.REMITTANCE_PHONE_NUMBER}`
                )}
                {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.REMITTANCE_PHONE_NUMBER}`)}
                disabled={isLoading}
                onChange={setFieldValue}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Accordion>
  );
};

type Props = {
  title: string;
  prefix?: string;
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
  showGeneralInfoSection?: boolean;
  showShipInfoSection?: boolean;
  showRemittanceInfoSection?: boolean;
};

export default UserTypeInfoForm;
