import { Error } from '@mui/icons-material';
import { Stack } from '@mui/material';
import React from 'react';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { ROLE_NAME, isPI, isSU } from 'src/queries/Profile/helpers';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { Navigator, RoleService, Toastify } from 'src/services';
import { handleScrollToTopError } from 'src/utils';
import { isEmpty } from 'src/validations';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormValue, UpsertPOFormikProps } from '../types';
import DeletePOWarning from '../deletePOWarning';
import {
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
} from 'src/queries/PurchaseOrders/helpers';
import { IRootState } from 'src/redux/rootReducer';
import { setFormData, setIsImmutableFormData, setPoFormAction } from 'src/redux/form/formSlice';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PO_ACTION, PO_MODE, usePostPOCloneDocument } from 'src/queries';
import urljoin from 'url-join';

const ActionButtons: React.FC<Props> = ({
  formikProps,
  currentPOMode,
  disabled = false,
  loading = false,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
  onSetPoFormAction,
  onShowDialog,
  onHideDialog,
}) => {
  const { id } = useParams<{ id: string }>();
  const isEditPOMode = !!id;
  const [isTriedSubmit, setIsTriedSubmit] = React.useState<boolean>(false);

  const {
    values,
    errors,
    setFieldValue,
    dirty: isFormDirty,
    handleSubmit,
    validateForm,
  } = formikProps;
  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;
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

  const _handleScrollToTopError = React.useCallback(() => {
    handleScrollToTopError(errors);
  }, [errors]);

  React.useEffect(() => {
    if (formAction && isTriedSubmit) {
      _handleScrollToTopError();
      handleSubmit();
    }

    return () => setIsTriedSubmit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTriedSubmit]);

  const { postPOCloneDocument } = usePostPOCloneDocument({});

  // set form action states for updating form's validation schema purpose
  const handleConfirmSubmitForm = (action) => {
    onSetIsImmutableFormData(false);
    setFieldValue(PO_FORM_KEY.ACTION, action);
    onSetPoFormAction(action);
    setIsTriedSubmit(true);
    validateForm();
  };

  const handleSubmitClick = ({ action }: { action: PO_ACTION }) => {
    if (!isEmpty(values.placeholderFileAttachment)) {
      onShowDialog({
        type: DIALOG_TYPES.YESNO_DIALOG,
        data: {
          title: 'Attention',
          content: 'Your file wasn’t uploaded. Do you want to continue without uploading the file?',
          onOk: () => {
            handleConfirmSubmitForm(action);
            setFieldValue(PO_FORM_KEY.PLACEHOLDER_FILE_ATTACHMENT, null);
            onHideDialog();
          },
          onCancel: () => {
            onHideDialog();
          },
        },
      });
    } else {
      handleConfirmSubmitForm(action);
    }
  };

  const handleCancelClick = () => {
    if (!isFormDirty) {
      Navigator.navigate(PATHS.dashboard);
      onSetFormData(null);
    } else {
      Navigator.navigate(PATHS.dashboard);
    }
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
    postPOCloneDocument(
      { id: values.id },
      {
        onSuccess() {
          Toastify.success('Clone Document successfully.');
          Navigator.navigate(urljoin(PATHS.purchaseOrderDetail, values.id));
        },
        onError(error: Error) {
          Toastify.error(error.message);
        },
      }
    );
  };

  return (
    <Stack my={4} flexDirection={'row'} justifyContent="center">
      <Button variant="outline" className="mr-8" onClick={handleCancelClick}>
        Cancel
      </Button>
      {showDeleteButton && (
        <Button variant="outline" className="mr-8" onClick={handleDeleteClick} disabled={disabled}>
          Delete
        </Button>
      )}
      {showViewVendorPrintModeButton && (
        <Button onClick={handleViewVendorPrintMode} disabled={disabled} className="mr-8">
          Vendor Print Mode
        </Button>
      )}
      {showCloneDocumentButton && (
        <Button onClick={handleCloneDocument} disabled={disabled} className="mr-8">
          Clone Document
        </Button>
      )}
      {showApproveButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.APPROVE })}
          isLoading={loading && isPOApprovedAction(formAction)}
          disabled={disabled}
          className="mr-8"
        >
          Approve
        </Button>
      )}
      {showDisapproveButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.DISAPPROVE })}
          isLoading={loading && isPODisapproveAction(formAction)}
          disabled={disabled}
          className="mr-8"
        >
          Disapprove
        </Button>
      )}
      {showRequestMoreInfoButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.ADDITIONAL_INFO })}
          isLoading={loading && isPOAdditionalInfoAction(formAction)}
          disabled={disabled}
          className="mr-8"
        >
          Request More Info
        </Button>
      )}
      {showSaveButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.SAVE })}
          isLoading={loading && isPOSaveAction(formAction)}
          disabled={disabled}
          className="mr-8"
        >
          Save
        </Button>
      )}
      {showSubmitToFAButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.SUBMIT })}
          isLoading={loading && isPOSubmitAction(formAction)}
          disabled={disabled}
        >
          Submit to FA
        </Button>
      )}
    </Stack>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    formikProps: UpsertPOFormikProps;
    disabled?: boolean;
    loading?: boolean;
    currentPOMode?: PO_MODE;
  };

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  formAction: state.form.poFormAction,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
  onSetPoFormAction: setPoFormAction,
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ActionButtons));
