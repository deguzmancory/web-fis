import { Box, Typography } from '@mui/material';
import React from 'react';
import { Element, Input, RadioButton } from 'src/components/common';
import RequiredSign from 'src/containers/shared/RequiredSign';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { vendorOptions } from '../constants';
import { VENDOR_OPTION_VALUE, VENDOR_REGISTRATION_FORM_KEY } from '../enums';
import {
  isVendorRequiredEinNumber,
  isVendorRequiredRcuhNumber,
  isVendorRequiredTIN,
  isVendorRequiredUhNumber,
} from '../helpers';
import { VendorRegistrationFormikProps, VendorRegistrationFormValue } from '../types';

const SelectVendor: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const {
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

  const handleSelectVendorClass = (name: string, value: VENDOR_OPTION_VALUE) => {
    if (isVendorRequiredTIN(value)) {
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.UH_ID, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.RCUH_ID, '');
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.UH_ID, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.RCUH_ID, false);
    } else if (isVendorRequiredRcuhNumber(value)) {
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.SSN, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.EIN, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.UH_ID, '');
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.SSN, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.EIN, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.UH_ID, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.HAS_SSN_OR_EIN, false);
    } else if (isVendorRequiredUhNumber(value)) {
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.SSN, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.EIN, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.RCUH_ID, '');
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.SSN, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.EIN, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.RCUH_ID, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.HAS_SSN_OR_EIN, false);
    } else if (isVendorRequiredEinNumber(value)) {
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.SSN, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.UH_ID, '');
      setFieldValue(VENDOR_REGISTRATION_FORM_KEY.RCUH_ID, '');
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.SSN, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.UH_ID, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.RCUH_ID, false);
      setFieldTouched(VENDOR_REGISTRATION_FORM_KEY.HAS_SSN_OR_EIN, false);
    }

    setFieldValue(name, value);
  };

  return (
    <Element
      errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FED_TAX_CLASS)}
      showErrorBorder
    >
      <Typography variant="h5" mb={2}>
        4. My Vendor is (Select one below). A W-9 MUST BE ATTACHED FOR ALL ** CATEGORIES (UH WH-1 IS
        ALSO ACCEPTABLE FOR INDIVIDUALS) <RequiredSign />
      </Typography>
      <Box>
        <RadioButton
          columns={1}
          options={[
            ...vendorOptions,
            {
              label: VENDOR_OPTION_VALUE.OTHER,
              value: VENDOR_OPTION_VALUE.OTHER,
              subLabel: (
                <Box width={'30%'} ml={2}>
                  <Input
                    maxLength={45}
                    {...getUncontrolledFieldProps(
                      VENDOR_REGISTRATION_FORM_KEY.FED_TAX_CLASS_OTHER_DESCRIPTION
                    )}
                    errorMessage={_getErrorMessage(
                      VENDOR_REGISTRATION_FORM_KEY.FED_TAX_CLASS_OTHER_DESCRIPTION
                    )}
                    disabled={disabled}
                  />
                </Box>
              ),
            },
          ]}
          {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.FED_TAX_CLASS)}
          onChange={handleSelectVendorClass}
          itemClassName="mb-except-last-6"
          disabled={disabled}
        />
      </Box>
    </Element>
  );
};

type Props = {
  formikProps: VendorRegistrationFormikProps;
  disabled?: boolean;
};

export default React.memo(SelectVendor, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    VENDOR_REGISTRATION_FORM_KEY.FED_TAX_CLASS,
    VENDOR_REGISTRATION_FORM_KEY.FED_TAX_CLASS_OTHER_DESCRIPTION,
    VENDOR_REGISTRATION_FORM_KEY.FILE_ATTACHMENTS,
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
