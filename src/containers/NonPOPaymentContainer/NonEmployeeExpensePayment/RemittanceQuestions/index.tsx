import { Box, Grid, Link, Typography } from '@mui/material';
import { memo, useMemo } from 'react';
import TypographyLink from 'src/components/TypographyLink';
import { Checkbox, Input, InputUSPhone } from 'src/components/common';
import { PO_PAYMENT_VENDOR_TYPE } from 'src/containers/PurchaseOrderContainer/POPayment/enums';
import {
  getErrorMessage,
  getUncontrolledInputFieldProps,
  isEqualPrevAndNextFormikValues,
  isString,
  localTimeToHawaii,
} from 'src/utils';
import {
  NON_PO_PAYMENT_REMITTANCE_KEY,
  NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY,
} from '../../shared/Remittance/enum';
import { NON_EMPLOYEE_TRAVEL_FORM_KEY } from '../enums';
import { UpsertNonEmployeeTravelFormikProps } from '../types';

const prefixRemittance = NON_PO_PAYMENT_REMITTANCE_KEY.REMITTANCE;

const RemittanceQuestions: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { values, touched, errors, getFieldProps, setFieldTouched, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const _getUncontrolledFieldProps = getUncontrolledInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

  const renderTextCheckBox = useMemo(() => {
    const paymentType = isString(values.vendorName)
      ? values.vendorName
      : values.vendorName?.paymentType;
    switch (paymentType) {
      case PO_PAYMENT_VENDOR_TYPE.CHECK:
        setFieldValue(
          `${prefixRemittance}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.RETURN_REMITTANCE_FLAG}`,
          true
        );
        return {
          label: 'Return this check and remittance advice to fiscal office.',
          isDisabled: true,
        };
      case PO_PAYMENT_VENDOR_TYPE.ACH:
      case PO_PAYMENT_VENDOR_TYPE.CARD:
      case PO_PAYMENT_VENDOR_TYPE.TBD:
        return {
          label:
            'Override vendor preferred payment type and return this check and remittance advice to fiscal office instead.',
          isDisabled: false,
        };
      default:
        return {
          label: 'Return this check and remittance advice to fiscal office.',
          isDisabled: true,
        };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.vendorName]);

  return (
    <Box>
      <div style={{ display: 'contents' }}>
        <div style={{ display: 'contents' }}>Vendor preferred payment type</div>
        <div style={{ display: 'inline-block', margin: '0 8px' }}>
          <Input
            value={
              isString(values?.vendorName) ? values?.vendorName : values.vendorName?.paymentType
            }
            disabled
            style={{ width: 100 }}
          />
        </div>
        <div style={{ display: 'contents' }}>as of</div>
        <div style={{ display: 'inline-block', margin: '0 8px' }}>
          <Input
            value={
              isString(values.vendorName)
                ? values.vendorName
                : localTimeToHawaii(values.vendorName?.updatedAt)
            }
            disabled
            style={{ width: 180 }}
          />
        </div>
      </div>

      <Checkbox.Item
        label={
          <Typography variant="body2" style={{ display: 'contents' }}>
            {renderTextCheckBox.label}
            <TypographyLink variant="body2" style={{ display: 'contents' }}>
              <Link href="https://awsnode.test.rcuh.com/" target="_blank" ml={0.5}>
                What's This?
              </Link>
            </TypographyLink>
          </Typography>
        }
        {...getFieldProps(
          `${prefixRemittance}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.RETURN_REMITTANCE_FLAG}`
        )}
        errorMessage={_getErrorMessage(
          `${prefixRemittance}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.RETURN_REMITTANCE_FLAG}`
        )}
        disabled={renderTextCheckBox.isDisabled}
        style={{ margin: '8px 0' }}
      />

      <Typography variant="h5" my={2}>
        Questions on Remittance? - Contact
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={3.5}>
          <Input
            label="Name"
            errorMessage={_getErrorMessage(
              `${prefixRemittance}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.QUESTION_NAME}`
            )}
            {..._getUncontrolledFieldProps(
              `${prefixRemittance}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.QUESTION_NAME}`
            )}
            disabled={disabled}
            maxLength={30}
          />
        </Grid>

        <Grid item xs={3.5}>
          <InputUSPhone
            label={'Phone Number'}
            errorMessage={_getErrorMessage(
              `${prefixRemittance}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.QUESTION_PHONE_NUMBER}`
            )}
            {...getFieldProps(
              `${prefixRemittance}.${NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY.QUESTION_PHONE_NUMBER}`
            )}
            disabled={disabled}
            onChange={setFieldValue}
          />
        </Grid>
        {/* TODO: Tuyen Tran will open when BE add field email */}
        {/* <Grid item xs={3.5}>
          <Input label={'Email'} disabled={true} />
        </Grid> */}
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertNonEmployeeTravelFormikProps;
  disabled?: boolean;
};

export default memo(RemittanceQuestions, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [
        NON_PO_PAYMENT_REMITTANCE_KEY.REMITTANCE,
        NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_NAME,
        NON_EMPLOYEE_TRAVEL_FORM_KEY.VENDOR_CODE,
      ],
    })
  );
});
