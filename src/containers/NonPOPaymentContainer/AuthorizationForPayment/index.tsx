import { Box, Container } from '@mui/material';
import { useFormik } from 'formik';
import React, { FC, Suspense, useLayoutEffect, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { LoadingCommon } from 'src/components/common';
import { getCurrentEditMode } from 'src/containers/PurchaseOrderContainer/PO/helpers';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { useProfile } from 'src/queries';
import { isFinalMode, isSaveAction, isViewOnlyMode } from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { RoleService } from 'src/services';
import {
  getErrorMessageFromResponse,
  getUncontrolledInputFieldProps,
  handleShowErrorMsg,
} from 'src/utils';
import BreadcrumbsNonPOForm from '../shared/Breadcrumb';
import ErrorNonPOWrapper from '../shared/ErrorWrapper/index.';
import GeneralInfo from './GeneralInfo';
import Header from './Header';
import ReasonsForPayment from './ReasonsForPayment';
import Remittance from './Remittance';
import { emptyUpsertAuthorizationFormValue } from './helpers/constants';
import {
  getAuthorizationPaymentFormValueFromResponse,
  getInitialAuthorizationFormValue,
  getUpsertAuthorizationPaymentPayload,
} from './helpers/formValues';
import { getAuthorizationPaymentFormValidationSchema } from './helpers/validationSchema';
import { UpsertAuthorizationFormValue, UpsertAuthorizationPaymentFormikProps } from './types';
import FileAttachments from './FileAttachments';
import ProjectItems from '../shared/ProjectItems';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from './enum';
import EquipmentInventoriesV2 from 'src/containers/PurchaseOrderContainer/POPayment/EquipmentInventoriesV2';
import AuditInformation from '../shared/AuditInformation';
import ActionButtons from 'src/containers/PurchaseOrderContainer/PO/ActionButtons';
import DeleteWarning from '../NonEmployeeExpensePayment/DeleteWarning';
import { useCreateAuthorizationPayment } from 'src/queries/NonPOPayment/AuthorizationForPayment/useCreateAuthorizationPayment';
import { useUpdateAuthorizationPayment } from 'src/queries/NonPOPayment/AuthorizationForPayment/useUpdateAuthorizationPayment';
import { useGetAuthorizationPaymentDetail } from 'src/queries/NonPOPayment/AuthorizationForPayment/useGetAuthorizationPaymentDetail';
import Prompt from 'src/services/Prompt';
import { PATHS } from 'src/appConfig/paths';
import { Location } from 'history';

const AuthorizationForPayment: FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [apiError, setApiError] = React.useState<string>('');
  const [allowRedirectWithoutWarning, setAllowRedirectWithoutWarning] =
    React.useState<boolean>(false);

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

  const { onGetAuthorizationPaymentById, handleInvalidateAuthorizationPaymentDetail } =
    useGetAuthorizationPaymentDetail({
      id: id,
      onSuccess: (data) => {
        const formValue: UpsertAuthorizationFormValue =
          getAuthorizationPaymentFormValueFromResponse({ response: data, profile });
        onSetFormData<UpsertAuthorizationFormValue>(formValue);
      },
      onError: (error) => {
        handleShowErrorMsg(error);
      },
      suspense: true,
    });

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

  // edit mode
  // using useEffect for fetch data from api
  useEffect(() => {
    if (isEditMode && !isImmutableFormData) {
      onGetAuthorizationPaymentById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, onGetAuthorizationPaymentById]);

  const {
    createAuthorizationPayment,
    data: createAuthorizationPaymentResponse,
    isLoading: createAuthorizationPaymentLoading,
    isSuccess: isCreateAuthorizationPaymentSuccess,
  } = useCreateAuthorizationPayment({
    onSuccess: () => {
      onSetFormData(null);

      //continue navigate to success page with use effect above => for ignore prompt check url when crate succeed purpose
    },
    onError: (error) => {
      handleShowErrorMsg(error);

      window.scrollTo(0, 0);
      setApiError(getErrorMessageFromResponse(error));
    },
  });

  const {
    updateAuthorizationPayment,
    data: updateAuthorizationPaymentResponse,
    isLoading: updateAuthorizationPaymentLoading,
    isSuccess: isUpdateAuthorizationPayemntSuccess,
  } = useUpdateAuthorizationPayment({
    onSuccess: () => {
      if (!isSaveAction(formAction)) {
        onSetFormData(null);
      }

      window.scrollTo(0, 0);
      //continue navigate to success page with use effect above => for ignore prompt check url when crate succeed purpose
    },
    onError: (error) => {
      handleShowErrorMsg(error);
    },
  });

  const handleFormSubmit = (values: UpsertAuthorizationFormValue) => {
    if (isEditMode) {
      const editAuthorizationPaymentPayload = getUpsertAuthorizationPaymentPayload({
        formValues: values,
        action: values.action,
      });
      updateAuthorizationPayment(editAuthorizationPaymentPayload);
    } else {
      const createAuthorizationPaymentPayload = getUpsertAuthorizationPaymentPayload({
        formValues: values,
        action: values.action,
      });
      createAuthorizationPayment(createAuthorizationPaymentPayload);
    }
  };

  const isLoading = createAuthorizationPaymentLoading || updateAuthorizationPaymentLoading;

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

  const handleConfirmCancel = () => {
    onSetFormData(null);
  };

  const blockCondition = (location: Location<string>) => {
    if (allowRedirectWithoutWarning) return false;

    if (isEditMode && location.pathname.includes(PATHS.createPurchaseOrders)) {
      onSetIsImmutableFormData(false);
      return true;
    }

    const acceptablePaths = [
      PATHS.createPurchaseOrders,
      PATHS.purchaseOrderDetail,
      PATHS.poAdditionalForm,
      PATHS.addVendorRegistration,
    ];
    const isAcceptablePath = acceptablePaths.some((path) => location.pathname.includes(path));

    if (isAcceptablePath) {
      return false;
    }

    const success = isEditMode
      ? isUpdateAuthorizationPayemntSuccess
      : isCreateAuthorizationPaymentSuccess;

    if (!success) {
      return isFormDirty;
    }
  };

  return (
    <Prompt
      title={'Leave site?'}
      message={'There are unsaved changes on the Form. Are you sure you want to leave this page?'}
      cancelOkText="Yes, leave"
      cancelText="No, stay"
      condition={blockCondition}
      onConfirmNavigationClick={handleConfirmCancel}
    >
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
                  <ReasonsForPayment
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentMode={currentAuthorizationMode}
                  />
                </SectionLayout>

                <SectionLayout>
                  <Remittance formikProps={formikProps} disabled={disabledSection} />
                </SectionLayout>

                <SectionLayout sx={{ p: 0, border: 'none' }}>
                  <EquipmentInventoriesV2
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentPOMode={currentAuthorizationMode}
                    authorizationPaymentPrefix={AUTHORIZATION_FOR_PAYMENT_KEY.EQUIPMENT_INVENTORIES}
                  />
                </SectionLayout>

                <SectionLayout sx={{ p: 0, border: 'none' }}>
                  <FileAttachments
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentPOMode={currentAuthorizationMode}
                  />
                </SectionLayout>

                <SectionLayout sx={{ p: 0, border: 'none' }}>
                  <AuditInformation
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentPOMode={currentAuthorizationMode}
                  />
                </SectionLayout>

                <ActionButtons
                  currentFormMode={currentAuthorizationMode}
                  formikProps={formikProps}
                  loading={isLoading}
                  disabled={isLoading}
                  callback={() => setApiError(null)}
                  warningDeleteContainer={
                    <DeleteWarning id={id} onDelete={() => setAllowRedirectWithoutWarning(true)} />
                  }
                />
              </>
            )}
          </Suspense>
        </Container>
      </Box>
    </Prompt>
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
