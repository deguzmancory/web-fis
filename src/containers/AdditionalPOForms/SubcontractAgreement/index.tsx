import { Box, Container, Stack } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { TextareaAutosize } from 'src/components/common';
import { initialSubcontractorValue } from 'src/containers/PurchaseOrderContainer/constants';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { SubcontractorPayload } from 'src/queries';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { getErrorMessage, getUncontrolledInputFieldProps } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_ADDITIONAL_FORM_KEY, PO_ADDITIONAL_FORM_PARAMS } from '../enum';
import { PO_SUBCONTRACT_AGREEMENT_KEY } from './enum';
import StandardsLayout from './StanDards';
import WitnessethFormLayout from './Witnesseth';

const SubcontractAgreementForm: React.FC<Props> = ({
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
      subcontractor: initialSubcontractorValue,
    });
    onSetIsImmutableFormData(true);
  };

  const formik = useFormik<SubcontractorPayload>({
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

  const formikProps: CommonFormikProps<SubcontractorPayload> = {
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
  }, [formData, onSetFormData, onSetIsImmutableFormData, values]);

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
        <Stack alignItems={'center'}>
          <TextareaAutosize
            resize="none"
            containerClassName={'form-element-content'}
            style={{ width: '100%', padding: '2px 16px', marginTop: '10px' }}
            errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR)}
            {..._getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR)}
          />
        </Stack>

        <SectionLayout>
          <WitnessethFormLayout formikProps={formikProps} />
        </SectionLayout>

        <SectionLayout>
          <StandardsLayout formikProps={formikProps} />
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
  isImmutableFormData: state.form.isImmutableFormData,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubcontractAgreementForm);
