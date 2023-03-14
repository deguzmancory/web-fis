import { Box, Container } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { emptyUpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/constants';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { POAuthToPurchasePayload } from 'src/queries/PurchaseOrders';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getUncontrolledInputFieldProps } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_ADDITIONAL_FORM_KEY, PO_ADDITIONAL_FORM_PARAMS } from '../enum';
import CheckAndFill from './CheckAndFill';
import FormCompleted from './FormCompleted';
import PreAcquisition from './PreAcquisition';
import RequOrPurchOrder from './RequOrPurchOrder';

const AuthToPurchaseForm: React.FC<Props> = ({ formRef, formData, onSetFormData, disabled }) => {
  const history = useHistory();

  const handleFormSubmit = () => {
    handleSaveForm();
    Navigator.navigate(
      `${PATHS.createPurchaseOrders}?${PO_ADDITIONAL_FORM_PARAMS.SCROLL_TO}=${PO_ADDITIONAL_FORM_KEY.ADDITIONAL_FORMS}`
    );
  };

  const handleResetForm = () => {
    onSetFormData<UpsertPOFormValue>({
      ...formData,
      authToPurchase: emptyUpsertPOFormValue.authToPurchase,
    });
  };

  const formik = useFormik<POAuthToPurchasePayload>({
    initialValues: formData?.authToPurchase,
    validationSchema: null,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    onReset: handleResetForm,
  });

  React.useImperativeHandle(formRef, () => ({
    ...formik,
  }));

  const { values, errors, touched, setFieldValue, setFieldTouched, getFieldProps } = formik;

  const formikProps: CommonFormikProps<POAuthToPurchasePayload> = {
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
  }, [formData, onSetFormData, values]);

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
        <SectionLayout>
          <RequOrPurchOrder formikProps={formikProps} />
        </SectionLayout>

        <SectionLayout>
          <CheckAndFill formikProps={formikProps} />
        </SectionLayout>

        <SectionLayout>
          <PreAcquisition formikProps={formikProps} />
        </SectionLayout>

        <SectionLayout>
          <FormCompleted formikProps={formikProps} />
        </SectionLayout>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    disabled: boolean;
    formRef: RefObject<FormikProps<any>>;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthToPurchaseForm);
