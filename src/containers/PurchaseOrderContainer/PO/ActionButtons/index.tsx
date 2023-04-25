import { Error } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { ReactElement, memo, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { UpsertAuthorizationPaymentFormikProps } from 'src/containers/NonPOPaymentContainer/AuthorizationForPayment/types';
import { UpsertNonEmployeeTravelFormikProps } from 'src/containers/NonPOPaymentContainer/NonEmployeeExpensePayment/types';
import { PO_ACTION, PO_MODE, usePostPOCloneDocument } from 'src/queries';
import { ROLE_NAME, isPI, isSU } from 'src/queries/Profile/helpers';
import {
  isAdditionalInfoAction,
  isApprovedAction,
  isCUReviewMode,
  isDisapproveAction,
  isFAReviewMode,
  isFinalMode,
  isPiSuEditMode,
  isSaveAction,
  isSubmitAction,
  isViewOnlyMode,
} from 'src/queries/PurchaseOrders/helpers';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { setFormData, setIsImmutableFormData, setPoFormAction } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Callback } from 'src/redux/types';
import { Navigator, RoleService, Toastify } from 'src/services';
import { handleScrollToTopError } from 'src/utils';
import { isEmpty } from 'src/validations';
import urljoin from 'url-join';
import { UpdatePOPaymentFormikProps } from '../../POPayment/types';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormValue, UpsertPOFormikProps } from '../types';
import { PersonalAutomobileFormikProps } from '../../../NonPOPaymentContainer/PersonalAutomobileMileageVoucher/types';

const ActionButtons = <
  T extends
    | UpsertPOFormikProps
    | UpdatePOPaymentFormikProps
    | UpsertNonEmployeeTravelFormikProps
    | UpsertAuthorizationPaymentFormikProps
    | PersonalAutomobileFormikProps
>({
  formikProps,
  currentFormMode,
  disabled = false,
  loading = false,
  formAction,
  warningDeleteContainer,
  onSetFormData,
  onSetIsImmutableFormData,
  onSetPoFormAction,
  onShowDialog,
  onHideDialog,
  showCloneDocument = true,
  showVendorPrintMode = true,
  callback,
}: Props<T>) => {
  const { id } = useParams<{ id: string }>();
  const isEditPOMode = !!id;
  const [isTriedSubmit, setIsTriedSubmit] = useState<boolean>(false);

  const {
    values,
    errors,
    dirty: isFormDirty,
    setFieldValue,
    handleSubmit,
    validateForm,
  } = formikProps;
  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;
  const showDeleteButton = isPiSuEditMode(currentFormMode);
  const showApproveButton = isFAReviewMode(currentFormMode) || isCUReviewMode(currentFormMode);
  const showDisapproveButton = isFAReviewMode(currentFormMode);
  const showRequestMoreInfoButton =
    isFAReviewMode(currentFormMode) || isCUReviewMode(currentFormMode);
  const showSaveButton = !isViewOnlyMode(currentFormMode);
  const showSubmitToFAButton = !isEditPOMode || isPiSuEditMode(currentFormMode);
  const showViewVendorPrintModeButton = showVendorPrintMode && isFinalMode(currentFormMode);
  const showCloneDocumentButton =
    showCloneDocument && isFinalMode(currentFormMode) && (isPI(currentRole) || isSU(currentRole));

  const _handleScrollToTopError = useCallback(() => {
    handleScrollToTopError(errors);
  }, [errors]);

  useEffect(() => {
    if (formAction && isTriedSubmit) {
      _handleScrollToTopError();
      handleSubmit();
    }

    return () => setIsTriedSubmit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTriedSubmit]);

  const { postPOCloneDocument } = usePostPOCloneDocument({
    onSuccess: (data) => {
      Toastify.success('Clone Document Successful!');
      Navigator.navigate(urljoin(PATHS.purchaseOrderDetail, data?.data?.id));
    },
    onError(error: Error) {
      Toastify.error(error.message);
    },
  });

  // set form action states for updating form's validation schema purpose
  const handleConfirmSubmitForm = (action) => {
    onSetIsImmutableFormData(false);
    setFieldValue(PO_FORM_KEY.ACTION, action);
    onSetPoFormAction(action);
    setIsTriedSubmit(true);
    validateForm();
    if (callback) {
      callback();
    }
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
        content: warningDeleteContainer,
      },
    });
  };

  const handleViewVendorPrintMode = () => {
    Navigator.navigate(urljoin(PATHS.vendorPrintMode, values?.id));
  };

  const handleCloneDocument = () => {
    postPOCloneDocument({ id: values.id });
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
          isLoading={loading && isApprovedAction(formAction)}
          disabled={disabled}
          className="mr-8"
        >
          Approve
        </Button>
      )}
      {showDisapproveButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.DISAPPROVE })}
          isLoading={loading && isDisapproveAction(formAction)}
          disabled={disabled}
          className="mr-8"
        >
          Disapprove
        </Button>
      )}
      {showRequestMoreInfoButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.ADDITIONAL_INFO })}
          isLoading={loading && isAdditionalInfoAction(formAction)}
          disabled={disabled}
          className="mr-8"
        >
          Request More Info
        </Button>
      )}
      {showSaveButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.SAVE })}
          isLoading={loading && isSaveAction(formAction)}
          disabled={disabled}
          className="mr-8"
        >
          Save
        </Button>
      )}
      {showSubmitToFAButton && (
        <Button
          onClick={() => handleSubmitClick({ action: PO_ACTION.SUBMIT })}
          isLoading={loading && isSubmitAction(formAction)}
          disabled={disabled}
        >
          Submit to FA
        </Button>
      )}
    </Stack>
  );
};

type Props<
  T extends
    | UpsertPOFormikProps
    | UpdatePOPaymentFormikProps
    | UpsertNonEmployeeTravelFormikProps
    | UpsertAuthorizationPaymentFormikProps
    | PersonalAutomobileFormikProps
> = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    formikProps: T extends UpsertPOFormikProps
      ? UpsertPOFormikProps
      : T extends UpdatePOPaymentFormikProps
      ? UpdatePOPaymentFormikProps
      : T extends UpsertNonEmployeeTravelFormikProps
      ? UpsertNonEmployeeTravelFormikProps
      : T extends UpsertAuthorizationPaymentFormikProps
      ? UpsertAuthorizationPaymentFormikProps
      : T extends PersonalAutomobileFormikProps
      ? PersonalAutomobileFormikProps
      : unknown;
    disabled?: boolean;
    loading?: boolean;
    currentFormMode?: PO_MODE;
    showCloneDocument?: boolean;
    showVendorPrintMode?: boolean;
    warningDeleteContainer: ReactElement;
    callback?: Callback;
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

export default connect(mapStateToProps, mapDispatchToProps)(memo(ActionButtons));
