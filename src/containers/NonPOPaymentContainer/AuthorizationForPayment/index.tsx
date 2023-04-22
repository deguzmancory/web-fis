import { Box, Container } from '@mui/material';
import { useFormik } from 'formik';
import React, { FC, Suspense, useLayoutEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { LoadingCommon } from 'src/components/common';
import { getCurrentEditMode } from 'src/containers/PurchaseOrderContainer/PO/helpers';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { useProfile } from 'src/queries';
import { isFinalMode, isViewOnlyMode } from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { RoleService } from 'src/services';
import { getUncontrolledInputFieldProps } from 'src/utils';
import BreadcrumbsNonPOForm from '../shared/Breadcrumb';
import ErrorNonPOWrapper from '../shared/ErrorWrapper/index.';
import GeneralInfo from './GeneralInfo';
import Header from './Header';
import ReasonsForPayment from './ReasonsForPayment';
import Remittance from './Remittance';
import { emptyUpsertAuthorizationFormValue } from './helpers/constants';
import { getInitialAuthorizationFormValue } from './helpers/formValues';
import { getAuthorizationPaymentFormValidationSchema } from './helpers/validationSchema';
import { UpsertAuthorizationFormValue, UpsertAuthorizationPaymentFormikProps } from './types';
import FileAttachments from './FileAttachments';
import ProjectItems from '../shared/ProjectItems';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from './enum';

const AuthorizationForPayment: FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const currentRole = RoleService.getCurrentRole();
  const hasPermission = true; //TODO: enhancement: check logic to be granted tp access the this resource

  const poStatus = useMemo(() => formData?.status, [formData?.status]);

  const currentAuthorizationMode = useMemo(
    () => getCurrentEditMode({ id, status: poStatus, currentRole }),
    [id, poStatus, currentRole]
  );

  const disabledSection =
    isViewOnlyMode(currentAuthorizationMode) || isFinalMode(currentAuthorizationMode);
  const { profile } = useProfile();

  const handleFormSubmit = () => {};

  const initialFormValue = useMemo(() => formData || emptyUpsertAuthorizationFormValue, [formData]);

  const validationSchema = useMemo(
    () => getAuthorizationPaymentFormValidationSchema({ action: formAction }),
    [formAction]
  );

  useLayoutEffect(() => {
    const isInitialEmptyForm = !isEditMode && !isImmutableFormData;

    if (isInitialEmptyForm) {
      const initialAuthorizationFormValue = getInitialAuthorizationFormValue({ profile });
      onSetFormData<UpsertAuthorizationFormValue>(initialAuthorizationFormValue);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, profile]);

  const {
    values,
    errors,
    touched,
    dirty: isFormDirty,
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    handleSubmit,
    validateForm,
  } = useFormik<UpsertAuthorizationFormValue>({
    initialValues: initialFormValue,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  const formikProps: UpsertAuthorizationPaymentFormikProps = {
    values,
    errors,
    touched,
    dirty: isFormDirty,
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    getUncontrolledFieldProps: getUncontrolledInputFieldProps({
      values,
      setFieldTouched,
      setFieldValue,
    }),
    handleSubmit,
    validateForm,
  };

  return (
    <Box py={4}>
      <Container maxWidth="lg">
        <BreadcrumbsNonPOForm />
        <Header />
        <Suspense fallback={<LoadingCommon />}>
          {!hasPermission ? (
            <SectionLayout>
              <NoPermission />
            </SectionLayout>
          ) : (
            <>
              <SectionLayout>
                <GeneralInfo
                  formikProps={formikProps}
                  disabled={disabledSection}
                  currentMode={currentAuthorizationMode}
                />
              </SectionLayout>

              <SectionLayout>
                <ProjectItems
                  formikProps={formikProps}
                  disabled={disabledSection}
                  currentMode={currentAuthorizationMode}
                  projectItemsPrefix={AUTHORIZATION_FOR_PAYMENT_KEY.PROJECT_LINE_ITEMS}
                  totalPrefix={AUTHORIZATION_FOR_PAYMENT_KEY.TOTAL}
                />
              </SectionLayout>

              <SectionLayout>
                <ReasonsForPayment formikProps={formikProps} disabled={disabledSection} />
              </SectionLayout>

              <SectionLayout>
                <Remittance formikProps={formikProps} disabled={disabledSection} />
              </SectionLayout>

              <SectionLayout>
                <FileAttachments formikProps={formikProps} disabled={disabledSection} />
              </SectionLayout>
            </>
          )}
        </Suspense>
      </Container>
    </Box>
  );
};

const AuthorizationForPaymentWrapper: React.FC<Props> = ({ ...props }) => {
  return (
    <CustomErrorBoundary FallbackComponent={(props) => <ErrorNonPOWrapper {...props} />}>
      <Suspense
        fallback={
          <Box minHeight="80vh" p={4}>
            <LoadingCommon />
          </Box>
        }
      >
        <AuthorizationForPayment {...props} />
      </Suspense>
    </CustomErrorBoundary>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState<any>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  formAction: state.form.poFormAction,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizationForPaymentWrapper);
