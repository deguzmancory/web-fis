import { Box, Typography } from '@mui/material';
import React from 'react';
import { Input, RadioButton } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { VENDOR_OPTION_VALUE, VENDOR_REGISTRATION_FORM_KEY } from '../enums';
import { vendorOptions } from '../helpers';
import { VendorRegistrationFormikProps, VendorRegistrationFormValue } from '../types';

const SelectVendor: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName: VENDOR_REGISTRATION_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        4. My Vendor is (Select one below). A W-9 MUST BE ATTACHED FOR ALL ** CATEGORIES (UH WH-1 IS
        ALSO ACCEPTABLE FOR INDIVIDUALS). *
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
                    maxLength={10}
                    {...getUncontrolledFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
                    errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
                    disabled={disabled}
                  />
                </Box>
              ),
            },
          ]}
          {...getFieldProps(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
          errorMessage={_getErrorMessage(VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME)}
          onChange={setFieldValue}
          itemClassName="mb-except-last-16"
          disabled={disabled}
        />
      </Box>
    </Box>
  );
};

type Props = {
  formikProps: VendorRegistrationFormikProps;
  disabled?: boolean;
};

export default React.memo(SelectVendor, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [VENDOR_REGISTRATION_FORM_KEY.FIRST_NAME];

  return isEqualPrevAndNextFormikValues<VendorRegistrationFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
