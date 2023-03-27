import { Box, Container } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { initialAuthToPurchaseValue } from 'src/containers/PurchaseOrderContainer/constants';
import { PO_FORM_ELEMENT_ID, PO_FORM_PARAMS } from 'src/containers/PurchaseOrderContainer/enums';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { POAuthToPurchasePayload } from 'src/queries/PurchaseOrders';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getUncontrolledInputFieldProps } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import urljoin from 'url-join';
import CheckAndFill from './CheckAndFill';
import FormCompleted from './FormCompleted';
import PreAcquisition from './PreAcquisition';
import PurchaseInfo from './RequOrPurchOrder';

const AuthToPurchaseForm: React.FC<Props> = ({
  formRef,
  formData,
  onSetFormData,
  disabled,
  documentId,
  onSetIsImmutableFormData,
}) => {
  const history = useHistory();

  const handleFormSubmit = () => {
    handleSaveForm();
    if (documentId) {
      Navigator.navigate(
        `${urljoin(PATHS.purchaseOrderDetail, documentId)}?${PO_FORM_PARAMS.SCROLL_TO}=${
          PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS
        }`
      );
    } else {
      Navigator.navigate(
        `${PATHS.createPurchaseOrders}?${PO_FORM_PARAMS.SCROLL_TO}=${PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS}`
      );
    }
  };

  const handleResetForm = () => {
    onSetFormData<UpsertPOFormValue>({
      ...formData,
      authToPurchase: initialAuthToPurchaseValue,
    });
    onSetIsImmutableFormData(true);
  };

  const formik = useFormik<POAuthToPurchasePayload>({
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
    onSetIsImmutableFormData(true);
  }, [formData, onSetFormData, onSetIsImmutableFormData, values]);

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
          <PurchaseInfo formikProps={formikProps} />
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
    documentId: string;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthToPurchaseForm);
