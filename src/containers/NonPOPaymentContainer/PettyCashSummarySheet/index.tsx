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
import FormErrorSection from 'src/containers/shared/FormErrorSection';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { PO_ACTION, useProfile } from 'src/queries';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from 'src/queries/NonPOPayment';
import { useCreatePettyCash } from 'src/queries/NonPOPayment/PettyCash/useCreatePettyCash';
import { useGetPettyCashDetail } from 'src/queries/NonPOPayment/PettyCash/useGetPettyCashDetail';
import { useUpdatePettyCash } from 'src/queries/NonPOPayment/PettyCash/useUpdatePettyCash';
import {
  isCUReviewMode,
  isFAReviewMode,
  isFinalMode,
  isSaveAction,
  isViewOnlyMode,
} from 'src/queries/PurchaseOrders/helpers';
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
import QuestionOnRemittance from '../shared/Remittance/QuestionOnRemittance';
import RemittanceTableLineItems from '../shared/Remittance/TableLineItems';
import { SUBMITTED_NON_PO_PAYMENT_QUERY } from '../shared/SubmittedNonPO/enums';
import DeleteWarning from './DeleteWarning';
import GeneralInfo from './GeneralInfo';
import Header from './Header';
import { PETTY_CASH_FORM_KEY } from './enums';
import { emptyUpsertPettyCashFormValue } from './helpers/constants';
import {
  getInitialPettyCashFormValue,
  getPettyCashFormValueFromResponse,
  getUpsertPettyCashPayload,
} from './helpers/formValues';
import { getPettyCashFormValidationSchema } from './helpers/validationSchema';
import { UpsertPettyCashFormValue, UpsertPettyCashFormikProps } from './types';

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
  const [allowRedirectWithoutWarning, setAllowRedirectWithoutWarning] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const isEditMode = !!id;
  const hasPermission = true; //TODO: enhancement: check logic to be granted tp access the this resource
  const currentRole = RoleService.getCurrentRole();
  const poStatus = useMemo(() => formData?.status, [formData?.status]);
  const currentPettyCashMode = useMemo(
    () => getCurrentEditMode({ id, status: poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const disabledSection = isViewOnlyMode(currentPettyCashMode) || isFinalMode(currentPettyCashMode);
  const isReviewMode = isFAReviewMode(currentPettyCashMode) || isCUReviewMode(currentPettyCashMode);

  const { profile } = useProfile();

  const { onGetPettyCashById, handleInvalidatePettyCashDetail } = useGetPettyCashDetail({
    id: id,
    onSuccess: (data) => {
      const formValue: UpsertPettyCashFormValue = getPettyCashFormValueFromResponse({
        response: data,
        profile,
      });

      onSetFormData<UpsertPettyCashFormValue>(formValue);
    },
    onError: (error) => {
      handleShowErrorMsg(error);
    },
    suspense: true,
  });
  const {
    createPettyCash,
    data: createPettyCashResponse,
    isLoading: createPettyCashLoading,
    isSuccess: isCreatePettyCashSuccess,
  } = useCreatePettyCash({
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
    updatePettyCash,
    data: updatePettyCashResponse,
    isLoading: updatePettyCashLoading,
    isSuccess: isUpdatePettyCashSuccess,
  } = useUpdatePettyCash({
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

  const isLoading = createPettyCashLoading || updatePettyCashLoading;

  // Navigate to submitted Non Employee Travel success page
  useEffect(() => {
    if ((isCreatePettyCashSuccess || isUpdatePettyCashSuccess) && !isLoading) {
      const responseData = isEditMode ? updatePettyCashResponse : createPettyCashResponse;

      switch (formAction) {
        case PO_ACTION.SAVE: {
          Toastify.success(`Saved form successfully.`);
          Navigator.navigate(`${PATHS.pettyCashPaymentDetail}/${responseData.data.id}`);
          return;
        }
        case PO_ACTION.SUBMIT: {
          Navigator.navigate(
            `${PATHS.submittedNonPOPayment}/${responseData.data.id}?${SUBMITTED_NON_PO_PAYMENT_QUERY.NUMBER}=${responseData.data.requestNumber}&${SUBMITTED_NON_PO_PAYMENT_QUERY.DOCUMENT_TYPE}=${NON_PO_PAYMENT_DOCUMENT_TYPE.PETTY_CASH_PAYMENT}`
          );
          return;
        }

        case PO_ACTION.APPROVE: {
          Toastify.success(`Approved successfully.`);
          handleInvalidatePettyCashDetail();
          onGetPettyCashById();
          return;
        }

        case PO_ACTION.DISAPPROVE: {
          Toastify.success(`Disapproved successfully.`);
          handleInvalidatePettyCashDetail();
          onGetPettyCashById();
          return;
        }

        case PO_ACTION.ADDITIONAL_INFO: {
          Toastify.success(`Request more info successfully.`);
          handleInvalidatePettyCashDetail();
          onGetPettyCashById();
          return;
        }

        default: {
          handleInvalidatePettyCashDetail();
          onGetPettyCashById();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatePettyCashSuccess, isUpdatePettyCashSuccess]);

  /* INIT DATA */
  // get initial data when first time mounted

  // create mode
  // using useLayoutEffect to avoid flash at first time render
  useLayoutEffect(() => {
    const isInitialEmptyForm = !isEditMode && !isImmutableFormData;

    if (isInitialEmptyForm) {
      const initialPettyCashFormValue = getInitialPettyCashFormValue({ profile });
      onSetFormData<UpsertPettyCashFormValue>(initialPettyCashFormValue);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, profile, onSetFormData]);

  // edit mode
  // using useEffect for fetch data from api
  useEffect(() => {
    if (isEditMode && !isImmutableFormData) {
      onGetPettyCashById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, onGetPettyCashById]);

  // else formData && isImmutableFormData
  // => just back from additional forms or create vendor registration form => not fetching anything
  /* END INIT DATA */

  // mark as form no longer is immutable.
  // The next time component did mount:
  //  * if isImmutableFormData is true => it will reset to initial empty form
  //  * if isImmutableFormData is false => it will get the formData from Redux to initial form
  useEffect(() => {
    return () => {
      onSetIsImmutableFormData(false);
    };
  }, [onSetIsImmutableFormData]);

  const handleFormSubmit = (values: UpsertPettyCashFormValue) => {
    if (isEditMode) {
      const editPettyCashPayload = getUpsertPettyCashPayload({
        formValues: values,
        action: values.action,
      });
      updatePettyCash(editPettyCashPayload);
    } else {
      const createPettyCashPayload = getUpsertPettyCashPayload({
        formValues: values,
        action: values.action,
      });
      createPettyCash(createPettyCashPayload);
    }
  };

  const initialFormValue = useMemo(() => formData || emptyUpsertPettyCashFormValue, [formData]);

  const validationSchema = useMemo(
    () => getPettyCashFormValidationSchema({ action: formAction }),
    [formAction]
  );

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
  } = useFormik<UpsertPettyCashFormValue>({
    initialValues: initialFormValue,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  const formikProps: UpsertPettyCashFormikProps = {
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

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const blockCondition = (location: Location<string>) => {
    if (allowRedirectWithoutWarning) return false;

    if (isEditMode && location.pathname.includes(PATHS.createPurchaseOrders)) {
      onSetIsImmutableFormData(false);
      return true;
    }

    const acceptablePaths = [
      PATHS.pettyCashPaymentDetail,
      PATHS.createPettyCashPayment,
      PATHS.addVendorRegistration,
    ];
    const isAcceptablePath = acceptablePaths.some((path) => location.pathname.includes(path));

    if (isAcceptablePath) {
      return false;
    }

    const success = isEditMode ? isUpdatePettyCashSuccess : isCreatePettyCashSuccess;

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

                <SectionLayout
                  header={
                    <HeaderOfSection
                      documentType={NON_PO_PAYMENT_DOCUMENT_TYPE.PETTY_CASH_PAYMENT}
                    />
                  }
                >
                  <GeneralInfo
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                    currentMode={currentPettyCashMode}
                  />
                </SectionLayout>
                <SectionLayout>
                  <ProjectItems
                    title={'PROJECT(S) TO BE CHARGED'}
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                    projectItemsPrefix={PETTY_CASH_FORM_KEY.PROJECT_LINE_ITEMS}
                    totalPrefix={PETTY_CASH_FORM_KEY.PAYMENT_TOTAL}
                    showTotalError={false}
                    tableErrorMessage={
                      projectItemsError || _getErrorMessage(PETTY_CASH_FORM_KEY.PAYMENT_TOTAL)
                    }
                  />
                </SectionLayout>

                <SectionLayout>
                  <RemittanceTableLineItems
                    formikProps={formikProps}
                    disableReferenceNumber
                    disabled={disabledSection || isReviewMode}
                  />
                  <QuestionOnRemittance
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                  />
                </SectionLayout>

                <SectionLayout sx={{ p: 0, border: 'none' }}>
                  {isEditMode ? (
                    <FileAttachments
                      formikProps={formikProps}
                      disabled={isViewOnlyMode(currentPettyCashMode)}
                      allowActionAfterFinalApproveOnly={isFinalMode(currentPettyCashMode)}
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
                  <InternalComments
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                  />
                </SectionLayout>

                <ActionButtons
                  currentFormMode={currentPettyCashMode}
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

const PettyCashPayment: FC<Props> = ({ ...props }) => {
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

const mapStateToProps = (state: IRootState<UpsertPettyCashFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  formAction: state.form.poFormAction,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PettyCashPayment);
