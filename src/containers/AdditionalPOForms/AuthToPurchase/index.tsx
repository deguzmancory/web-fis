import { Box, Container, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { initialAuthToPurchaseValue } from 'src/containers/PurchaseOrderContainer/constants';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { POAuthToPurchase } from 'src/queries/PurchaseOrders';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Toastify } from 'src/services';
import { getUncontrolledInputFieldProps } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import HeaderOfSection from '../headerSection';
import { handleNavigateBackToMainForm } from '../helpers';
import CheckAndFill from './CheckAndFill';
import FormCompleted from './FormCompleted';
import PreAcquisition from './PreAcquisition';
import PurchaseInfo from './RequOrPurchOrder';

const AuthToPurchaseForm: React.FC<Props> = ({
  formRef,
  formData,
  onSetFormData,
  disabled = false,
  documentId,
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
      authToPurchase: initialAuthToPurchaseValue,
    });
    onSetIsImmutableFormData(true);
  };

  const formik = useFormik<POAuthToPurchase>({
    initialValues: formData?.authToPurchase || initialAuthToPurchaseValue,
    validationSchema: null,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    onReset: handleResetForm,
  });

  React.useImperativeHandle(formRef, () => ({
    ...formik,
  }));

  const { values, errors, touched, setFieldValue, setFieldTouched, getFieldProps } = formik;

  const formikProps: CommonFormikProps<POAuthToPurchase> = {
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
    onSetFormData<UpsertPOFormValue>({ ...formData, authToPurchase: values });
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

  return (
    <Box>
      <Container maxWidth="lg">
        <SectionLayout
          header={
            <HeaderOfSection
              href={'https://www.rcuh.com/2-000/2-200/2-212/'}
              label={'RCUH Policy 2.212'}
              label_left={'UH FORM 39 (PMO)'}
            />
          }
        >
          <PurchaseInfo formikProps={formikProps} disabled={disabled} />
        </SectionLayout>

        <SectionLayout>
          <CheckAndFill formikProps={formikProps} disabled={disabled} />
        </SectionLayout>

        <Typography
          borderBottom={COLOR_CODE.DEFAULT_BORDER}
          variant="h5"
          sx={{
            backgroundColor: COLOR_CODE.PRIMARY_500,
            color: COLOR_CODE.GRAY_LIGHT,
            py: 1.5,
            px: 3,
            mt: 2,
          }}
        >
          Pre acquisition Equipment Screening Certification
        </Typography>
        <SectionLayout sx={{ mt: 0 }}>
          <PreAcquisition formikProps={formikProps} disabled={disabled} />
        </SectionLayout>

        <SectionLayout>
          <FormCompleted formikProps={formikProps} disabled={disabled} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AuthToPurchaseForm);
