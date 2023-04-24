import { Box, Container, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Location } from 'history';
import { FC, Suspense, lazy, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { LoadingCommon } from 'src/components/common';
import ActionButtons from 'src/containers/PurchaseOrderContainer/PO/ActionButtons';
import { getCurrentEditMode } from 'src/containers/PurchaseOrderContainer/PO/helpers';
import EquipmentInventoriesV2 from 'src/containers/PurchaseOrderContainer/POPayment/EquipmentInventoriesV2';
import FormErrorSection from 'src/containers/shared/FormErrorSection';
import SectionLayout from 'src/containers/shared/SectionLayout';
import {
  NON_PO_PAYMENT_DOCUMENT_TYPE,
  PO_ACTION,
  useCreateAuthorizationPayment,
  useGetAuthorizationPaymentDetail,
  useProfile,
  useUpdateAuthorizationPayment,
} from 'src/queries';
import { isFinalMode, isSaveAction, isViewOnlyMode } from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import {
  getErrorMessage,
  getErrorMessageFromResponse,
  getUncontrolledInputFieldProps,
  handleShowErrorMsg,
} from 'src/utils';
import BreadcrumbsNonPOForm from '../shared/Breadcrumb';
import ErrorNonPOWrapper from '../shared/ErrorWrapper/index.';
import HeaderOfSection from '../shared/HeaderOfSection';
import InternalComments from '../shared/InternalComments';
import ProjectItems from '../shared/ProjectItems';
import { SUBMITTED_NON_PO_PAYMENT_QUERY } from '../shared/SubmittedNonPO/enums';
import DeleteWarning from './DeleteWarning';
import GeneralInfo from './GeneralInfo';
import Header from './Header';
import ReasonsForPayment from './ReasonsForPayment';
import Remittance from './Remittance';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from './enum';
import { emptyUpsertAuthorizationFormValue } from './helpers/constants';
import {
  getAuthorizationPaymentFormValueFromResponse,
  getInitialAuthorizationFormValue,
  getUpsertAuthorizationPaymentPayload,
} from './helpers/formValues';
import { getAuthorizationPaymentFormValidationSchema } from './helpers/validationSchema';
import { UpsertAuthorizationFormValue, UpsertAuthorizationPaymentFormikProps } from './types';

const FileAttachments = lazy(() => import('./FileAttachments'));
const AuditInformation = lazy(() => import('../shared/AuditInformation'));

const AuthorizationForPayment: FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [apiError, setApiError] = useState<string>('');
  const [allowRedirectWithoutWarning, setAllowRedirectWithoutWarning] = useState<boolean>(false);

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

  const {
    updateAuthorizationPayment,
    data: updateAuthorizationPaymentResponse,
    isLoading: updateAuthorizationPaymentLoading,
    isSuccess: isUpdateAuthorizationPaymentSuccess,
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

  const initialFormValue = useMemo(() => formData || emptyUpsertAuthorizationFormValue, [formData]);

  const validationSchema = useMemo(
    () => getAuthorizationPaymentFormValidationSchema({ action: formAction }),
    [formAction]
  );

  // Navigate to submitted PO success page
  useEffect(() => {
    if (
      (isCreateAuthorizationPaymentSuccess || isUpdateAuthorizationPaymentSuccess) &&
      !isLoading
    ) {
      const responseData = isEditMode
        ? updateAuthorizationPaymentResponse
        : createAuthorizationPaymentResponse;

      switch (formAction) {
        case PO_ACTION.SAVE: {
          Toastify.success(`Saved form successfully.`);
          Navigator.navigate(`${PATHS.authorizationForPaymentDetail}/${responseData.data.id}`);
          return;
        }
        case PO_ACTION.SUBMIT: {
          Navigator.navigate(
            `${PATHS.submittedNonPOPayment}/${responseData.data.id}?${SUBMITTED_NON_PO_PAYMENT_QUERY.NUMBER}=${responseData.data.requestNumber}&${SUBMITTED_NON_PO_PAYMENT_QUERY.DOCUMENT_TYPE}=${NON_PO_PAYMENT_DOCUMENT_TYPE.AUTHORIZATION_PAYMENT}`
          );
          return;
        }

        case PO_ACTION.APPROVE: {
          Toastify.success(`Approved successfully.`);
          handleInvalidateAuthorizationPaymentDetail();
          onGetAuthorizationPaymentById();
          return;
        }

        case PO_ACTION.DISAPPROVE: {
          Toastify.success(`Disapprove successfully.`);
          handleInvalidateAuthorizationPaymentDetail();
          onGetAuthorizationPaymentById();
          return;
        }

        case PO_ACTION.ADDITIONAL_INFO: {
          Toastify.success(`Request more info successfully.`);
          handleInvalidateAuthorizationPaymentDetail();
          onGetAuthorizationPaymentById();
          return;
        }

        default: {
          handleInvalidateAuthorizationPaymentDetail();
          onGetAuthorizationPaymentById();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateAuthorizationPaymentSuccess, isUpdateAuthorizationPaymentSuccess]);

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

  const handleFormSubmit = (values: UpsertAuthorizationFormValue, errors) => {
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

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
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
      ? isUpdateAuthorizationPaymentSuccess
      : isCreateAuthorizationPaymentSuccess;

    if (!success) {
      return isFormDirty;
    } 
  };

  const projectItemsError =
    touched.projectLineItems && errors.projectLineItems && values.projectLineItems?.length === 1
      ? 'At least one Project # is required.'
      : '';

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
                {apiError && <FormErrorSection>{apiError}</FormErrorSection>}
                <SectionLayout header={<HeaderOfSection />}>
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
                    totalPrefix={AUTHORIZATION_FOR_PAYMENT_KEY.PAYMENT_TOTAL}
                    showTotalError={false}
                    tableErrorMessage={
                      projectItemsError ||
                      _getErrorMessage(AUTHORIZATION_FOR_PAYMENT_KEY.PAYMENT_TOTAL)
                    }
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
                  {isEditMode ? (
                    <FileAttachments
                      formikProps={formikProps}
                      disabled={isViewOnlyMode(currentAuthorizationMode)}
                      allowActionAfterFinalApproveOnly={isFinalMode(currentAuthorizationMode)}
                    />
                  ) : (
                    <SectionLayout sx={{ p: 2 }}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant={'h5'}>File Attachments: </Typography>
                        <Typography variant="body2" ml={1} mt={'1px'}>
                          (Please Save the Document before adding File Attachments)
                        </Typography>
                      </Stack>
                    </SectionLayout>
                  )}
                </SectionLayout>

                {isEditMode && (
                  <SectionLayout sx={{ p: 0, border: 'none' }}>
                    <AuditInformation auditTrails={values.auditTrails} />
                  </SectionLayout>
                )}

                <SectionLayout>
                  <InternalComments formikProps={formikProps} disabled={disabledSection} />
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
