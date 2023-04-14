import { Box, Container, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TextareaAutosize } from 'src/components/common';
import { initialSubcontractorValue } from 'src/containers/PurchaseOrderContainer/helpers';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { Subcontractor } from 'src/queries';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Toastify } from 'src/services';
import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import HeaderOfSection from '../headerSection';
import { handleNavigateBackToMainForm } from '../helpers';
import WitnessethFormLayout from './Witnesseth';
import { PO_SUBCONTRACT_AGREEMENT_KEY } from './enum';
import StandardsLayout from './StandardsLayout';

const SubcontractAgreementForm: React.FC<Props> = ({
  formRef,
  formData,
  disabled,
  documentId,
  onSetFormData,
  onSetIsImmutableFormData,
  hrefNavigationForm,
}) => {
  const history = useHistory();

  const handleFormSubmit = () => {
    handleSaveForm();
    handleNavigateBackToMainForm({
      documentId,
      hrefNavigationForm,
      documentType: formData?.documentType,
    });
  };

  const handleResetForm = () => {
    onSetFormData<UpsertPOFormValue>({
      ...formData,
      subcontractor: initialSubcontractorValue,
    });
    onSetIsImmutableFormData(true);
  };

  const formik = useFormik<Subcontractor>({
    initialValues: formData?.subcontractor || initialSubcontractorValue,
    validationSchema: null,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    onReset: handleResetForm,
  });

  React.useImperativeHandle(formRef, () => ({
    ...formik,
  }));

  const { values, errors, touched, setFieldValue, setFieldTouched, getFieldProps } = formik;

  const formikProps: CommonFormikProps<Subcontractor> = {
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

  const handleSaveForm = React.useCallback(() => {
    onSetFormData<UpsertPOFormValue>({ ...formData, subcontractor: values });
    onSetIsImmutableFormData(true);
    if (!disabled) {
      Toastify.success('Save changes successfully.');
    }
  }, [formData, disabled, onSetFormData, onSetIsImmutableFormData, values]);

  React.useEffect(() => {
    return history.listen(() => {
      if (history.action === 'POP') {
        handleSaveForm();
      }
    });
  }, [history, handleSaveForm]);

  const _getUncontrolledFieldProps = getUncontrolledInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

  const _getErrorMessage = (fieldName: PO_SUBCONTRACT_AGREEMENT_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <Typography variant="h3" textAlign="center">
          and
        </Typography>
        <Stack alignItems={'center'}>
          <TextareaAutosize
            resize="none"
            containerClassName={'form-element-content'}
            style={{ width: '100%', padding: '2px 16px', marginTop: '10px' }}
            errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR)}
            {..._getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR)}
            disabled={disabled}
          />
        </Stack>

        <SectionLayout
          header={
            <HeaderOfSection
              href={'https://www.rcuh.com/2-000/2-200/2-207/'}
              label={'RCUH Policy 2.207'}
            />
          }
        >
          <WitnessethFormLayout formikProps={formikProps} disabled={disabled} />
        </SectionLayout>

        <SectionLayout>
          <StandardsLayout formikProps={formikProps} disabled={disabled} />
        </SectionLayout>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    disabled: boolean;
    formRef: RefObject<FormikProps<any>>;
    documentId: string;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  hrefNavigationForm: state.form.hrefNavigateAdditionalForm,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubcontractAgreementForm);
