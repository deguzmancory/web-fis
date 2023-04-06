import { Box, Container } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { initialSoleSourceValue } from 'src/containers/PurchaseOrderContainer/constants';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { POSoleSourcePayload } from 'src/queries/PurchaseOrders';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Toastify } from 'src/services';
import { getUncontrolledInputFieldProps } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import HeaderOfSection from '../headerSection';
import { handleNavigateBackToMainForm } from '../helpers';
import Certification from '../shared/Certification';
import SoleSourceInfo from './SoleSourceInfo';
import SoleSourceStatement from './SoleSourceStatement';
import SoleSourceSubject from './SoleSubject';

const SoleSourceForm: React.FC<Props> = ({
  formRef,
  formData,
  disabled = false,
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
      soleSource: initialSoleSourceValue,
    });
    onSetIsImmutableFormData(true);
  };

  const formik = useFormik<POSoleSourcePayload>({
    initialValues: formData?.soleSource || initialSoleSourceValue,
    validationSchema: null,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    onReset: handleResetForm,
  });

  React.useImperativeHandle(formRef, () => ({
    ...formik,
  }));

  const { values, errors, touched, setFieldValue, setFieldTouched, getFieldProps } = formik;

  const handleSaveForm = React.useCallback(() => {
    onSetFormData<UpsertPOFormValue>({ ...formData, soleSource: values });
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

  const formikProps: CommonFormikProps<POSoleSourcePayload> = {
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
      <Container maxWidth="lg">
        <SectionLayout
          header={
            <HeaderOfSection
              href={'https://www.rcuh.com/2-000/2-100/2-106/'}
              label={'RCUH Policy 2.106'}
            />
          }
        >
          <SoleSourceInfo />
        </SectionLayout>

        <SectionLayout>
          <SoleSourceSubject formikProps={formikProps} disabled={disabled} />
        </SectionLayout>

        <SectionLayout>
          <SoleSourceStatement formikProps={formikProps} disabled={disabled} />
        </SectionLayout>

        <SectionLayout>
          <Certification formikProps={formikProps} haveRequestText={false} disabled={disabled} />
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
  hrefNavigationForm: state.form.hrefNavigateAdditionalForm,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SoleSourceForm);
