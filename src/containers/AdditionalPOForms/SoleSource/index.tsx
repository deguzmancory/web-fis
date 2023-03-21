import { Box, Container } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { POSoleSourcePayload } from 'src/queries/PurchaseOrders';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getUncontrolledInputFieldProps } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_ADDITIONAL_FORM_KEY, PO_ADDITIONAL_FORM_PARAMS } from '../enum';
import SoleSourceInfo from './SoleSourceInfo';
import SoleSourceSubject from './SoleSubject';
import SoleSourceStatement from './SoleSourceStatement';
import Certification from '../shared/Certification';
import { initialSoleSourceValue } from 'src/containers/PurchaseOrderContainer/constants';

const SoleSourceForm: React.FC<Props> = ({
  formRef,
  formData,
  onSetFormData,
  disabled,
  onSetIsImmutableFormData,
}) => {
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
  }, [formData, onSetFormData, onSetIsImmutableFormData, values]);

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
        <SectionLayout>
          <SoleSourceInfo />
        </SectionLayout>

        <SectionLayout>
          <SoleSourceSubject formikProps={formikProps} />
        </SectionLayout>

        <SectionLayout>
          <SoleSourceStatement formikProps={formikProps} />
        </SectionLayout>

        <SectionLayout>
          <Certification formikProps={formikProps} haveRequestText={false} />
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
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SoleSourceForm);
