import { Error } from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Location } from 'history';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import NoPermission from 'src/components/NoPermission';
import { Button, LoadingCommon } from 'src/components/common';
import { emptyUpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/constants';
import DeletePOWarning from 'src/containers/PurchaseOrderContainer/deletePOWarning';
import {
  PO_ACTION,
  PO_FORM_ELEMENT_ID,
  PO_FORM_KEY,
  SUBMITTED_PO_QUERY,
} from 'src/containers/PurchaseOrderContainer/enums';
import {
  getCurrentPOEditMode,
  getPOFormValueFromResponse,
  getUpsertPOPayload,
  isCUReviewPOMode,
  isFAReviewPOMode,
  isFinalPOMode,
  isPOAdditionalInfoAction,
  isPOApprovedAction,
  isPODisapproveAction,
  isPOSaveAction,
  isPOSubmitAction,
  isPiSuEditPOMode,
  isViewOnlyPOMode,
} from 'src/containers/PurchaseOrderContainer/helpers';
import {
  UpsertPOFormValue,
  UpsertPOFormikProps,
} from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { PO_DOCUMENT_TYPE, useGetPODetail, useProfile, useUpdatePO } from 'src/queries';
import { ROLE_NAME, isPI, isSU } from 'src/queries/Profile/helpers';
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
import { PO_CHANGE_FORM_QUERY_KEY } from '../POChangeForm/enums';
import { PO_CHANGE_FORM_NUMBER } from '../SelectChangeFormType/enums';
import BreadcrumbsPOChangeForm from '../breadcrumbs';

const POChangeForm: React.FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  onShowDialog,
}) => {
  const { id } = useParams<{ id: string }>();
  const [formAction, setFormAction] = React.useState<PO_ACTION>(null);
  const [isTriedSubmit, setIsTriedSubmit] = React.useState<boolean>(false);

  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  const formNumber = React.useMemo(
    () => query.get(PO_CHANGE_FORM_QUERY_KEY.FORM_NUMBER) || null,
    [query]
  );
  const scrollToParam = React.useMemo(
    () => query.get(PO_CHANGE_FORM_QUERY_KEY.SCROLL_TO) || null,
    [query]
  );
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

  const hasPermission = true; //TODO: update when enhancement needed
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
  const showSubmitToFAButton = isPiSuEditPOMode(currentPOMode);
  const showViewVendorPrintModeButton = isFinalPOMode(currentPOMode);
  const showCloneDocumentButton =
    isFinalPOMode(currentPOMode) && (isPI(currentRole) || isSU(currentRole));

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
    if (isUpdatePOSuccess) {
      const responseData = updatePOResponse;

      switch (formAction) {
        case PO_ACTION.SAVE: {
          Toastify.success(`Saved form successfully.`);
          Navigator.navigate(`${PATHS.poChangeForm}/${responseData.data.id}`);
          return;
        }
        case PO_ACTION.SUBMIT: {
          Navigator.navigate(
            `${PATHS.submittedPurchaseOrder}/${responseData.data.id}?${SUBMITTED_PO_QUERY.PO_NUMBER}=${responseData.data.number}&${SUBMITTED_PO_QUERY.DOCUMENT_TYPE}=${PO_DOCUMENT_TYPE.PO_CHANGE}`
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
  }, [isUpdatePOSuccess]);

  /* INIT DATA */
  React.useEffect(() => {
    if (!isImmutableFormData) {
      onGetPOById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onGetPOById]);

  // mark as form no longer is immutable.
  // The next time component did mount:
  //  * if isImmutableFormData is true => it will reset to initial empty form
  //  * if isImmutableFormData is false => it will get the formData from Redux to initial form
  React.useEffect(() => {
    return () => {
      onSetIsImmutableFormData(false);
    };
  }, [onSetIsImmutableFormData]);

  const initialFormValue = React.useMemo(() => formData || emptyUpsertPOFormValue, [formData]);

  const handleFormSubmit = (values: UpsertPOFormValue) => {
    const editPOPayload = getUpsertPOPayload({ formValues: values, action: values.action });
    updatePO(editPOPayload);
  };

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
    validationSchema: null, //todo: add validation
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

  const getFormTitle = React.useCallback((formNumber: PO_CHANGE_FORM_NUMBER) => {
    switch (formNumber) {
      case PO_CHANGE_FORM_NUMBER.TOTAL_CANCELLATION_NUMBER:
        return '(Total Cancellation)';
      case PO_CHANGE_FORM_NUMBER.CHANGE_DESCRIPTION_NUMBER:
        return '(Description Change Only)';
      case PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_NUMBER:
        return '(Increase/Decrease Balance)';
      case PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_TERMINATED_NUMBER:
        return '(Terminated Project)';

      default:
        return '(UNKNOWN FORM)';
    }
  }, []);

  const renderForm = React.useCallback((formNumber: PO_CHANGE_FORM_NUMBER) => {}, []);

  // set form action states for updating form's validation schema purpose
  const handleSubmitClick = ({ action }: { action: PO_ACTION }) => {
    onSetIsImmutableFormData(false);
    setFieldValue(PO_FORM_KEY.ACTION, action);
    setFormAction(action);
    setIsTriedSubmit(true);
    validateForm();
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

  const blockCondition = (location: Location<string>) => {
    const acceptablePaths = [PATHS.poAdditionalForm];
    const isAcceptablePath = acceptablePaths.some((path) => location.pathname.includes(path));

    if (isAcceptablePath) {
      return false;
    }

    if (!isUpdatePOSuccess) {
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
          <BreadcrumbsPOChangeForm />
          <Typography mt={2} variant="h2">
            RCUH Purchase Order Change Form RCUH {getFormTitle(formNumber as PO_CHANGE_FORM_NUMBER)}
          </Typography>
          <Suspense fallback={<LoadingCommon />}>
            {!hasPermission ? (
              <SectionLayout>
                <NoPermission />
              </SectionLayout>
            ) : (
              <>{renderForm(formNumber as PO_CHANGE_FORM_NUMBER)}</>
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
                disabled={updatePOLoading}
              >
                Delete
              </Button>
            )}
            {showViewVendorPrintModeButton && (
              <Button
                onClick={handleViewVendorPrintMode}
                disabled={updatePOLoading}
                className="mr-8"
              >
                Vendor Print Mode
              </Button>
            )}
            {showCloneDocumentButton && (
              <Button onClick={handleCloneDocument} disabled={updatePOLoading} className="mr-8">
                Clone Document
              </Button>
            )}
            {showApproveButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.APPROVE })}
                isLoading={updatePOLoading && isPOApprovedAction(formAction)}
                disabled={updatePOLoading}
                className="mr-8"
              >
                Approve
              </Button>
            )}
            {showDisapproveButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.DISAPPROVE })}
                isLoading={updatePOLoading && isPODisapproveAction(formAction)}
                disabled={updatePOLoading}
                className="mr-8"
              >
                Disapprove
              </Button>
            )}
            {showRequestMoreInfoButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.ADDITIONAL_INFO })}
                isLoading={updatePOLoading && isPOAdditionalInfoAction(formAction)}
                disabled={updatePOLoading}
                className="mr-8"
              >
                Request More Info
              </Button>
            )}
            {showSaveButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.SAVE })}
                isLoading={updatePOLoading && isPOSaveAction(formAction)}
                disabled={updatePOLoading}
                className="mr-8"
              >
                Save
              </Button>
            )}
            {showSubmitToFAButton && (
              <Button
                onClick={() => handleSubmitClick({ action: PO_ACTION.SUBMIT })}
                isLoading={updatePOLoading && isPOSubmitAction(formAction)}
                disabled={updatePOLoading}
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

export default connect(mapStateToProps, mapDispatchToProps)(POChangeForm);
