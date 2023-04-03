import { Error } from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Location } from 'history';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button, LoadingCommon } from 'src/components/common';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import {
  PO_DOCUMENT_TYPE,
  useCreatePO,
  useGetPODetail,
  useProfile,
  useUpdatePO,
} from 'src/queries';
import { isPI, isSU, ROLE_NAME } from 'src/queries/Profile/helpers';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import {
  getUncontrolledInputFieldProps,
  handleScrollToTopError,
  handleShowErrorMsg,
} from 'src/utils';
import SectionLayout from '../shared/SectionLayout';
import AdditionalForms from './AdditionalForms';
import AuthorizedBy from './AuthorizedBy';
import BreadcrumbsPODetail from './breadcrumbs';
import { emptyUpsertPOFormValue } from './constants';
import DeletePOWarning from './deletePOWarning';
import {
  PO_ACTION,
  PO_FORM_ELEMENT_ID,
  PO_FORM_KEY,
  PO_FORM_PARAMS,
  SUBMITTED_PO_QUERY,
} from './enums';
import ErrorWrapperPO from './ErrorWrapper/index.';
import ExternalSpecialInstructions from './ExternalSpecialInstructions';
import GeneralInfo from './GeneralInfo';
import HeaderOfSection from './headerOfSection';
import {
  getCurrentPOEditMode,
  getInitialPOFormValue,
  getPOFormValidationSchema,
  getPOFormValueFromResponse,
  getUpsertPOPayload,
  isCUReviewPOMode,
  isFAReviewPOMode,
  isFinalPOMode,
  isPiSuEditPOMode,
  isPOAdditionalInfoAction,
  isPOApprovedAction,
  isPODisapproveAction,
  isPOSaveAction,
  isPOSubmitAction,
  isViewOnlyPOMode,
} from './helpers';
import InternalComments from './InternalComments';
import InternalSpecialInstructions from './InternalSpecialInstructions';
import PurchaseInfo from './PurchaseInfo';
import SendInvoiceInfo from './SendInvoiceInfo';
import TableLineItems from './TableLineItems';
import { UpsertPOFormikProps, UpsertPOFormValue } from './types';

const AuditInformation = React.lazy(() => import('./AuditInformation'));
const FileAttachments = React.lazy(() => import('./FileAttachments'));

const PurchaseOrderContainer: React.FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  onShowDialog,
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [formAction, setFormAction] = React.useState<PO_ACTION>(null);
  const [isTriedSubmit, setIsTriedSubmit] = React.useState<boolean>(false);
  const formRef = React.useRef<FormikProps<UpsertPOFormValue>>(null);
  const scrollToParam = query.get(PO_FORM_PARAMS.SCROLL_TO) || null;

  const isEditPOMode = !!id;
  const hasPermission = true; //TODO: huy_dang enhancement: check logic to be granted tp access the PO resource
  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;
  const poStatus = React.useMemo(() => formData?.status, [formData?.status]);
  const currentPOMode = React.useMemo(
    () => getCurrentPOEditMode({ id, poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const showDeleteButton = isPiSuEditPOMode(currentPOMode);
  const showApproveButton = isFAReviewPOMode(currentPOMode) || isCUReviewPOMode(currentPOMode);
  const showDisapproveButton = isFAReviewPOMode(currentPOMode);
  const showRequestMoreInfoButton =
    isFAReviewPOMode(currentPOMode) || isCUReviewPOMode(currentPOMode);
  const showSaveButton = !isViewOnlyPOMode(currentPOMode);
  const showSubmitToFAButton = !isEditPOMode || isPiSuEditPOMode(currentPOMode);
  const showViewVendorPrintModeButton = isFinalPOMode(currentPOMode);
  const showCloneDocumentButton =
    isFinalPOMode(currentPOMode) && (isPI(currentRole) || isSU(currentRole));
  const disabledSection = isViewOnlyPOMode(currentPOMode) || isFinalPOMode(currentPOMode);

  const { profile } = useProfile();
  const { onGetPOById, handleInvalidatePODetail } = useGetPODetail({
    id: id,
    onSuccess: (data) => {
      const formValue: UpsertPOFormValue = getPOFormValueFromResponse({ response: data, profile });

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
      if (!isPOSaveAction(formAction)) {
        onSetFormData(null);
      }

      window.scrollTo(0, 0);
      //continue navigate to success page with use effect above => for ignore prompt check url when crate succeed purpose
    },
    onError: (error) => {
      handleShowErrorMsg(error);
    },
  });

  // Navigate to submitted PO success page
  React.useEffect(() => {
    if (isCreatePOSuccess || isUpdatePOSuccess) {
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

        default: {
          handleInvalidatePODetail();
          onGetPOById();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatePOSuccess, isUpdatePOSuccess]);

  const isLoading = createPOLoading || updatePOLoading;

  /* INIT DATA */
  // get initial data when first time mounted

  // create mode
  // using useLayoutEffect to avoid flash at first time render
  React.useLayoutEffect(() => {
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
  React.useEffect(() => {
    if (isEditPOMode && !isImmutableFormData) {
      onGetPOById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditPOMode, onGetPOById]);

  // else formData && isImmutableFormData
  // => just back from additional forms or create vendor registration form => not fetching anything
  /* END INIT DATA */

  // Auto scroll to additional form section base on scrollToParam
  React.useEffect(() => {
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
  React.useEffect(() => {
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

  const initialFormValue = React.useMemo(() => formData || emptyUpsertPOFormValue, [formData]);

  const validationSchema = React.useMemo(
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
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    getUncontrolledFieldProps: getUncontrolledInputFieldProps({
      values,
      setFieldTouched,
      setFieldValue,
    }),
  };

  const _handleScrollToTopError = React.useCallback(() => {
    handleScrollToTopError(errors);
  }, [errors]);

  // set form action states for updating form's validation schema purpose
  const handleSubmitClick = ({ action }: { action: PO_ACTION }) => {
    onSetIsImmutableFormData(false);
    setFieldValue(PO_FORM_KEY.ACTION, action);
    setFormAction(action);
    setIsTriedSubmit(true);
    validateForm();
  };

  const handleCancelClick = () => {
    if (!isFormDirty) {
      Navigator.navigate(PATHS.dashboard);
      onSetFormData(null);
    } else {
      Navigator.navigate(PATHS.dashboard);
    }
  };

  const handleConfirmCancel = () => {
    onSetFormData(null);
  };

  const handleDeleteClick = () => {
    onShowDialog({
      type: DIALOG_TYPES.CONTENT_DIALOG,
      data: {
        title: 'Delete',
        iconTitle: <Error color="error" sx={{ mt: '2px' }} />,
        hideFooter: true,
        content: <DeletePOWarning id={id} />,
      },
    });
  };

  const handleViewVendorPrintMode = () => {
    //TODO: implement
  };

  const handleCloneDocument = () => {
    //TODO: implement
  };

  // handle submit form after updated the form's validation schema
  React.useEffect(() => {
    if (formAction && isTriedSubmit) {
      _handleScrollToTopError();
      handleSubmit();
    }

    return () => setIsTriedSubmit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTriedSubmit]);

  const blockCondition = (location: Location<string>) => {
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
                  <SectionLayout>
                    <FileAttachments
                      formikProps={formikProps}
                      disabled={isViewOnlyPOMode(currentPOMode)}
                      allowActionAfterFinalApproveOnly={isFinalPOMode(currentPOMode)}
                    />
                  </SectionLayout>
                )}
                {isEditPOMode && (
                  <SectionLayout>
                    <AuditInformation formikProps={formikProps} />
                  </SectionLayout>
                )}
                <SectionLayout>
                  <InternalComments formikProps={formikProps} disabled={disabledSection} />
                </SectionLayout>
              </>
            )}
          </Suspense>

          <Stack my={4} flexDirection={'row'} justifyContent="center">
            <Button variant="outline" className="mr-8" onClick={handleCancelClick}>
              Cancel
            </Button>
            {showDeleteButton && (
              <Button
                variant="outline"
                className="mr-8"
                onClick={handleDeleteClick}
                disabled={isLoading}
              >
                Delete
              </Button>
            )}
            {showViewVendorPrintModeButton && (
              <Button onClick={handleViewVendorPrintMode} disabled={isLoading} className="mr-8">
                Vendor Print Mode
              </Button>
            )}
            {showCloneDocumentButton && (
              <Button onClick={handleCloneDocument} disabled={isLoading} className="mr-8">
                Clone Document
              </Button>
            )}
            {showApproveButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.APPROVE })}
                isLoading={isLoading && isPOApprovedAction(formAction)}
                disabled={isLoading}
                className="mr-8"
              >
                Approve
              </Button>
            )}
            {showDisapproveButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.DISAPPROVE })}
                isLoading={isLoading && isPODisapproveAction(formAction)}
                disabled={isLoading}
                className="mr-8"
              >
                Disapprove
              </Button>
            )}
            {showRequestMoreInfoButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.ADDITIONAL_INFO })}
                isLoading={isLoading && isPOAdditionalInfoAction(formAction)}
                disabled={isLoading}
                className="mr-8"
              >
                Request More Info
              </Button>
            )}
            {showSaveButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.SAVE })}
                isLoading={isLoading && isPOSaveAction(formAction)}
                disabled={isLoading}
                className="mr-8"
              >
                Save
              </Button>
            )}
            {showSubmitToFAButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.SUBMIT })}
                isLoading={isLoading && isPOSubmitAction(formAction)}
                disabled={isLoading}
              >
                Submit to FA
              </Button>
            )}
          </Stack>
        </Container>
      </Box>
    </Prompt>
  );
};

const PurchaseOrderContainerWrapper: React.FC<Props> = ({ ...props }) => {
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
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderContainerWrapper);
