import { Box, Container, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Location } from 'history';
import { Suspense, lazy, FC, useRef, useMemo, useEffect, useLayoutEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { LoadingCommon } from 'src/components/common';
import {
  PO_ACTION,
  PO_DOCUMENT_TYPE,
  useCreatePO,
  useGetPODetail,
  useProfile,
  useUpdatePO,
} from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { isFinalMode, isSaveAction, isViewOnlyMode } from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import { getUncontrolledInputFieldProps, handleShowErrorMsg } from 'src/utils';
import ActionButtons from './ActionButtons';
import AdditionalForms from './AdditionalForms';
import AuthorizedBy from './AuthorizedBy';
import ErrorWrapperPO from './ErrorWrapper/index.';
import ExternalSpecialInstructions from './ExternalSpecialInstructions';
import GeneralInfo from './GeneralInfo';
import InternalComments from './InternalComments';
import InternalSpecialInstructions from './InternalSpecialInstructions';
import PurchaseInfo from './PurchaseInfo';
import SendInvoiceInfo from './SendInvoiceInfo';
import TableLineItems from './TableLineItems';
import BreadcrumbsPODetail from './breadcrumbs';
import { emptyUpsertPOFormValue } from './helpers/constants';
import { PO_FORM_ELEMENT_ID, PO_FORM_PARAMS, SUBMITTED_PO_QUERY } from './enums';
import HeaderOfSection from './headerOfSection';
import {
  getCurrentEditMode,
  getInitialPOFormValue,
  getPOFormValidationSchema,
  getPOFormValueFromResponse,
  getUpsertPOPayload,
} from './helpers';
import { UpsertPOFormValue, UpsertPOFormikProps } from './types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import DeletePOWarning from './DeletePOWarning';

const AuditInformation = lazy(() => import('./AuditInformation'));
const FileAttachments = lazy(() => import('./FileAttachments'));

const PurchaseOrderContainer: FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [allowRedirectWithoutWarning, setAllowRedirectWithoutWarning] = useState<boolean>(false);
  const formRef = useRef<FormikProps<UpsertPOFormValue>>(null);
  const scrollToParam = query.get(PO_FORM_PARAMS.SCROLL_TO) || null;

  const isEditPOMode = !!id;
  const hasPermission = true; //TODO: enhancement: check logic to be granted tp access the PO resource
  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;
  const poStatus = useMemo(() => formData?.status, [formData?.status]);
  const currentPOMode = useMemo(
    () => getCurrentEditMode({ id, status: poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const disabledSection = isViewOnlyMode(currentPOMode) || isFinalMode(currentPOMode);
  const { profile } = useProfile();

  const { onGetPOById, handleInvalidatePODetail } = useGetPODetail({
    id: id,
    onSuccess: (data) => {
      const formValue: UpsertPOFormValue = getPOFormValueFromResponse({
        response: data,
        profile,
      });

      onSetFormData<UpsertPOFormValue>(formValue);
    },
    onError: (error) => {
      handleShowErrorMsg(error);
    },
    suspense: true,
  });
  const {
    createPO,
    data: createPOResponse,
    isLoading: createPOLoading,
    isSuccess: isCreatePOSuccess,
  } = useCreatePO({
    onSuccess: () => {
      onSetFormData(null);

      //continue navigate to success page with use effect above => for ignore prompt check url when crate succeed purpose
    },
    onError: (error) => {
      handleShowErrorMsg(error);
    },
  });
  const {
    updatePO,
    data: updatePOResponse,
    isLoading: updatePOLoading,
    isSuccess: isUpdatePOSuccess,
  } = useUpdatePO({
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

  const isLoading = createPOLoading || updatePOLoading;

  // Navigate to submitted PO success page
  useEffect(() => {
    if ((isCreatePOSuccess || isUpdatePOSuccess) && !isLoading) {
      const responseData = isEditPOMode ? updatePOResponse : createPOResponse;

      switch (formAction) {
        case PO_ACTION.SAVE: {
          Toastify.success(`Saved form successfully.`);
          Navigator.navigate(`${PATHS.purchaseOrderDetail}/${responseData.data.id}`);
          return;
        }
        case PO_ACTION.SUBMIT: {
          Navigator.navigate(
            `${PATHS.submittedPurchaseOrder}/${responseData.data.id}?${SUBMITTED_PO_QUERY.PO_NUMBER}=${responseData.data.number}&${SUBMITTED_PO_QUERY.DOCUMENT_TYPE}=${PO_DOCUMENT_TYPE.PURCHASE_ORDER}`
          );
          return;
        }

        case PO_ACTION.APPROVE: {
          Toastify.success(`Approved successfully.`);
          handleInvalidatePODetail();
          onGetPOById();
          return;
        }

        case PO_ACTION.DISAPPROVE: {
          Toastify.success(`Disapproved successfully.`);
          handleInvalidatePODetail();
          onGetPOById();
          return;
        }

        case PO_ACTION.ADDITIONAL_INFO: {
          Toastify.success(`Request more info successfully.`);
          handleInvalidatePODetail();
          onGetPOById();
          return;
        }

        default: {
          handleInvalidatePODetail();
          onGetPOById();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatePOSuccess, isUpdatePOSuccess]);

  /* INIT DATA */
  // get initial data when first time mounted

  // create mode
  // using useLayoutEffect to avoid flash at first time render
  useLayoutEffect(() => {
    const isInitialEmptyForm = !isEditPOMode && !isImmutableFormData;

    if (isInitialEmptyForm) {
      const initialPOFormValue = getInitialPOFormValue({ profile });
      onSetFormData<UpsertPOFormValue>(initialPOFormValue);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditPOMode, profile, onSetFormData]);

  // edit mode
  // using useEffect for fetch data from api
  useEffect(() => {
    if (isEditPOMode && !isImmutableFormData) {
      onGetPOById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditPOMode, onGetPOById]);

  // else formData && isImmutableFormData
  // => just back from additional forms or create vendor registration form => not fetching anything
  /* END INIT DATA */

  // Auto scroll to additional form section base on scrollToParam
  useEffect(() => {
    if (scrollToParam && scrollToParam === PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS) {
      const additionalFormId = document.getElementById(PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS);

      if (additionalFormId) {
        setTimeout(() => {
          additionalFormId.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [scrollToParam]);

  // mark as form no longer is immutable.
  // The next time component did mount:
  //  * if isImmutableFormData is true => it will reset to initial empty form
  //  * if isImmutableFormData is false => it will get the formData from Redux to initial form
  useEffect(() => {
    return () => {
      onSetIsImmutableFormData(false);
    };
  }, [onSetIsImmutableFormData]);

  const handleFormSubmit = (values: UpsertPOFormValue) => {
    if (isEditPOMode) {
      const editPOPayload = getUpsertPOPayload({ formValues: values, action: values.action });
      updatePO(editPOPayload);
    } else {
      const createPOPayload = getUpsertPOPayload({ formValues: values, action: values.action });
      createPO(createPOPayload);
    }
  };

  const initialFormValue = useMemo(() => formData || emptyUpsertPOFormValue, [formData]);

  const validationSchema = useMemo(
    () => getPOFormValidationSchema({ action: formAction }),
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
  } = useFormik<UpsertPOFormValue>({
    initialValues: initialFormValue,
    validationSchema: validationSchema,
    innerRef: formRef,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  const formikProps: UpsertPOFormikProps = {
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

    if (isEditPOMode && location.pathname.includes(PATHS.createPurchaseOrders)) {
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

    const success = isEditPOMode ? isUpdatePOSuccess : isCreatePOSuccess;

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
          <BreadcrumbsPODetail isViewMode={isEditPOMode} />
          <Typography mt={2} variant="h2">
            {isEditPOMode ? 'Edit ' : ''}RCUH Purchase Requisition
          </Typography>
          <Suspense fallback={<LoadingCommon />}>
            {!hasPermission ? (
              <SectionLayout>
                <NoPermission />
              </SectionLayout>
            ) : (
              <>
                <SectionLayout header={<HeaderOfSection />}>
                  <GeneralInfo
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentPOMode={currentPOMode}
                    documentType={PO_DOCUMENT_TYPE.PURCHASE_ORDER}
                  />
                </SectionLayout>
                <SectionLayout>
                  <TableLineItems
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentPOMode={currentPOMode}
                  />
                </SectionLayout>
                <SectionLayout>
                  <PurchaseInfo
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentPOMode={currentPOMode}
                  />
                </SectionLayout>
                <SectionLayout>
                  <AdditionalForms formikProps={formikProps} disabled={disabledSection} />
                </SectionLayout>
                <SectionLayout>
                  <InternalSpecialInstructions
                    formikProps={formikProps}
                    disabled={disabledSection}
                  />
                </SectionLayout>
                <SectionLayout>
                  <ExternalSpecialInstructions
                    formikProps={formikProps}
                    disabled={disabledSection}
                  />
                </SectionLayout>
                <SectionLayout>
                  <SendInvoiceInfo
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentPOMode={currentPOMode}
                  />
                </SectionLayout>
                <SectionLayout>
                  <AuthorizedBy formikProps={formikProps} disabled={disabledSection} />
                </SectionLayout>
                {isEditPOMode && (
                  <SectionLayout sx={{ p: 0, border: 'none' }}>
                    <FileAttachments
                      formikProps={formikProps}
                      disabled={isViewOnlyMode(currentPOMode)}
                      allowActionAfterFinalApproveOnly={isFinalMode(currentPOMode)}
                    />
                  </SectionLayout>
                )}
                {isEditPOMode && (
                  <SectionLayout sx={{ p: 0, border: 'none' }}>
                    <AuditInformation formikProps={formikProps} />
                  </SectionLayout>
                )}
                <SectionLayout>
                  <InternalComments formikProps={formikProps} disabled={disabledSection} />
                </SectionLayout>

                <ActionButtons
                  currentFormMode={currentPOMode}
                  formikProps={formikProps}
                  loading={isLoading}
                  disabled={isLoading}
                  warningDeleteContainer={
                    <DeletePOWarning
                      id={id}
                      onDelete={() => setAllowRedirectWithoutWarning(true)}
                    />
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

const PurchaseOrderContainerWrapper: FC<Props> = ({ ...props }) => {
  return (
    <CustomErrorBoundary FallbackComponent={(props) => <ErrorWrapperPO {...props} />}>
      <Suspense
        fallback={
          <Box minHeight="80vh" p={4}>
            <LoadingCommon />
          </Box>
        }
      >
        <PurchaseOrderContainer {...props} />
      </Suspense>
    </CustomErrorBoundary>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  formAction: state.form.poFormAction,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderContainerWrapper);
