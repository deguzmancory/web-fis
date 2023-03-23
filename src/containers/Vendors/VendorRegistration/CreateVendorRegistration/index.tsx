import { Box } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React from 'react';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { getUncontrolledInputFieldProps } from 'src/utils';
import { VendorRegistrationFormikProps, VendorRegistrationFormValue } from './types';
import VendorInfo from './VendorInfo';
import CreateVendorRegistrationTitle from './titleHeader';
import SelectVendor from './SelectVendor';
import AssigneeInfo from './AssigneeInfo';

const CreateVendorRegistration: React.FC<Props> = ({ isViewOnly = false }) => {
  const formRef = React.useRef<FormikProps<VendorRegistrationFormValue>>(null);
  const handleFormSubmit = () => {};

  const { values, errors, touched, setFieldValue, getFieldProps, setFieldTouched, handleSubmit } =
    useFormik<VendorRegistrationFormValue>({
      initialValues: { firstName: '' },
      validationSchema: null,
      innerRef: formRef,
      enableReinitialize: true,
      onSubmit: handleFormSubmit,
    });

  const formikProps: VendorRegistrationFormikProps = {
    values,
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    getUncontrolledFieldProps: getUncontrolledInputFieldProps({
      values,
      setFieldTouched,
      setFieldValue,
    }),
  };

  return (
    <Box>
      <CreateVendorRegistrationTitle />
      <SectionLayout>
        <VendorInfo formikProps={formikProps} />
      </SectionLayout>
      <SectionLayout>
        <SelectVendor formikProps={formikProps} />
      </SectionLayout>
      <SectionLayout>
        <AssigneeInfo formikProps={formikProps} />
      </SectionLayout>
    </Box>
  );
};

type Props = {
  isViewOnly?: boolean;
};

export default CreateVendorRegistration;
