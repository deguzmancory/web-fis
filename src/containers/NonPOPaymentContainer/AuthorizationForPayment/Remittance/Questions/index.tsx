import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import { AUTHORIZATION_FOR_PAYMENT_KEY, AUTHORIZATION_REMITTANCE_KEY } from '../../enum';
import { UpsertAuthorizationPaymentFormikProps } from '../../types';
import { Box, Grid, Link, Typography } from '@mui/material';
import {
  Checkbox,
  InputUSPhone,
  Input,
  InputMask,
  LoadingCommon,
  Select,
} from 'src/components/common';
import TypographyLink from 'src/components/TypographyLink';
import React from 'react';
import { PO_PAYMENT_VENDOR_TYPE } from 'src/containers/PurchaseOrderContainer/POPayment/enums';
import { checkVendorPaymentType } from 'src/containers/PurchaseOrderContainer/POPayment/helpers';
import { StateService } from 'src/services';
import { useZipCode } from 'src/queries';
import { US_ZIP_CODE_LENGTH } from 'src/appConfig/constants';

const prefixRemittance = AUTHORIZATION_FOR_PAYMENT_KEY.REMITTANCE;

const Question: React.FC<Props> = ({ formikProps, disabled }) => {
  const { values, touched, errors, getFieldProps, setFieldTouched, setFieldValue } = formikProps;

  const statesOptions = React.useMemo(() => {
    return StateService.getStates();
  }, []);

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const _getUncontrolledFieldProps = getUncontrolledInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

  // Zip Code
  const { checkZipCode, isLoading: isLoadingZipCode } = useZipCode({
    onSuccess(data) {
      setFieldValue(
        `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_CITY}`,
        data.city
      );
      setFieldValue(
        `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_STATE}`,
        data.state
      );
      setFieldTouched(`${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_CITY}`, false);
      setFieldTouched(
        `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_STATE}`,
        false
      );
    },
    onError() {},
  });

  const isShowRemittance = React.useMemo(() => {
    return (
      values.remittance?.returnRemittanceFlag === true ||
      checkVendorPaymentType(values.preferredPaymentMethod as PO_PAYMENT_VENDOR_TYPE)
    );
  }, [values.preferredPaymentMethod, values.remittance?.returnRemittanceFlag]);

  const isCheckStatus = React.useMemo(() => {
    return values?.preferredPaymentMethod === PO_PAYMENT_VENDOR_TYPE.CHECK;
  }, [values?.preferredPaymentMethod]);

  const handleChangeZipCode = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    if (value?.length === US_ZIP_CODE_LENGTH) {
      checkZipCode(value);
    } else {
      setFieldValue(`${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_CITY}`, '');
      setFieldValue(`${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_STATE}`, '');
    }
    setFieldValue(field, value);
  };

  return (
    <Box>
      <div style={{ display: 'contents' }}>
        <div style={{ display: 'contents' }}>Vendor preferred payment type</div>
        <div style={{ display: 'inline-block', margin: '0 8px' }}>
          <Input value={values?.preferredPaymentMethod} disabled style={{ width: 100 }} />
        </div>
        <div style={{ display: 'contents' }}>as of</div>
        <div style={{ display: 'inline-block', margin: '0 8px' }}>
          <Input value={values?.preferredPaymentMethodTimestamp} disabled style={{ width: 100 }} />
        </div>
      </div>

      {isCheckStatus ? (
        <Checkbox.Item
          label={
            <Typography variant="body2" style={{ display: 'contents' }}>
              Return this check and remittance advice to fiscal office.
              <TypographyLink variant="body2" style={{ display: 'contents' }}>
                <Link href="https://awsnode.test.rcuh.com/" target="_blank" ml={0.5}>
                  What's This?
                </Link>
              </TypographyLink>
            </Typography>
          }
          {...getFieldProps(
            `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.RETURN_REMITTANCE_FLAG}`
          )}
          errorMessage={_getErrorMessage(
            `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.RETURN_REMITTANCE_FLAG}`
          )}
          disabled={disabled}
          style={{ margin: '8px 0' }}
        />
      ) : (
        <Checkbox.Item
          label={
            <Typography variant="body2" style={{ display: 'contents' }}>
              Override vendor preferred payment type and return this check and remittance advice to
              fiscal office instead.
              <TypographyLink variant="body2" style={{ display: 'contents' }}>
                <Link href="https://awsnode.test.rcuh.com/" target="_blank" ml={0.5}>
                  What's This?
                </Link>
              </TypographyLink>
            </Typography>
          }
          {...getFieldProps(
            `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.RETURN_REMITTANCE_FLAG}`
          )}
          errorMessage={_getErrorMessage(
            `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.RETURN_REMITTANCE_FLAG}`
          )}
          disabled={disabled}
          style={{ margin: '8px 0' }}
        />
      )}

      <Typography variant="h5" my={2}>
        Questions on Remittance? - Contact
      </Typography>

      <Grid container>
        <Grid container item spacing={2}>
          <Grid item xs={3.5}>
            <Input
              label="Name"
              errorMessage={_getErrorMessage(
                `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.QUESTION_NAME}`
              )}
              {..._getUncontrolledFieldProps(
                `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.QUESTION_NAME}`
              )}
              disabled={disabled}
              maxLength={30}
            />
          </Grid>
          <Grid item xs={3.5}>
            <InputUSPhone
              label={'Phone Number'}
              errorMessage={_getErrorMessage(
                `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.QUESTION_PHONE_NUMBER}`
              )}
              {...getFieldProps(
                `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.QUESTION_PHONE_NUMBER}`
              )}
              disabled={disabled}
              onChange={setFieldValue}
            />
          </Grid>
        </Grid>

        {isShowRemittance && (
          <>
            <Typography variant="body2" my={2}>
              The check will be mailed to this address:
            </Typography>

            <Grid item container spacing={2}>
              <Grid item xs={4}>
                <Input label="Name" value={values?.vendorName as string} disabled maxLength={30} />
              </Grid>

              <Grid item xs={8}>
                <Input label="Address" value={values?.vendorAddress} disabled maxLength={30} />
              </Grid>
            </Grid>

            <Typography variant="body2">
              To use a different address, fill out the fields below:
            </Typography>

            <Grid item container spacing={2} my={2}>
              <Grid item xs={4}>
                <Input label="Name" value={values?.vendorName as string} disabled maxLength={30} />
              </Grid>
              <Grid item xs={4}>
                <Input
                  label={'Attn.'}
                  errorMessage={_getErrorMessage(
                    `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_ATTENTION}`
                  )}
                  {..._getUncontrolledFieldProps(
                    `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_ATTENTION}`
                  )}
                  maxLength={39}
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  label={'Street'}
                  errorMessage={_getErrorMessage(
                    `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_STREET}`
                  )}
                  {..._getUncontrolledFieldProps(
                    `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_STREET}`
                  )}
                  disabled={disabled}
                  maxLength={35}
                />
              </Grid>
            </Grid>

            <Grid item container spacing={2} my={2}>
              <Grid item xs={4}>
                <Input
                  label="City"
                  errorMessage={_getErrorMessage(
                    `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_CITY}`
                  )}
                  {..._getUncontrolledFieldProps(
                    `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_CITY}`
                  )}
                  disabled={disabled}
                  maxLength={30}
                />
              </Grid>
              <Grid item xs={4}>
                <Select
                  options={statesOptions}
                  label={'State'}
                  errorMessage={_getErrorMessage(
                    `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_STATE}`
                  )}
                  {...getFieldProps(
                    `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.REMITTANCE_STATE}`
                  )}
                  onChange={setFieldValue}
                  isDisabled={disabled}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Grid container>
                  <Grid item xs={6}>
                    <InputMask
                      label={'Zipcode'}
                      errorMessage={_getErrorMessage(
                        `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.ZIP_CODE}`
                      )}
                      placeholder={'Zip Code'}
                      mask={'99999'}
                      {...getFieldProps(
                        `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.ZIP_CODE}`
                      )}
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
                  <Grid item xs={5}>
                    <InputMask
                      label={'  '}
                      errorMessage={_getErrorMessage(
                        `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.ZIP_CODE_PLUS4}`
                      )}
                      {...getFieldProps(
                        `${prefixRemittance}.${AUTHORIZATION_REMITTANCE_KEY.ZIP_CODE_PLUS4}`
                      )}
                      min={1}
                      mask={'9999'}
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertAuthorizationPaymentFormikProps;
  disabled?: boolean;
};

export default Question;
