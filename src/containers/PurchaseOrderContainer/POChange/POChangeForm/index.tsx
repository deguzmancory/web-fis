import { Box, Container, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Location } from 'history';
import { FC, Suspense, useEffect, useMemo, useState } from 'react';
import { AiFillWarning } from 'react-icons/ai';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { Accordion, LoadingCommon } from 'src/components/common';
import ActionButtons from 'src/containers/PurchaseOrderContainer/PO/ActionButtons';
import AdditionalForms from 'src/containers/PurchaseOrderContainer/PO/AdditionalForms';
import AuthorizedBy from 'src/containers/PurchaseOrderContainer/PO/AuthorizedBy';
import ErrorWrapperPO from 'src/containers/PurchaseOrderContainer/PO/ErrorWrapper/index.';
import FileAttachments from 'src/containers/PurchaseOrderContainer/PO/FileAttachments';
import GeneralInfo from 'src/containers/PurchaseOrderContainer/PO/GeneralInfo';
import InternalComments from 'src/containers/PurchaseOrderContainer/PO/InternalComments';
import {
  PO_FORM_ELEMENT_ID,
  SUBMITTED_PO_QUERY,
} from 'src/containers/PurchaseOrderContainer/PO/enums';
import HeaderOfSection from 'src/containers/PurchaseOrderContainer/PO/headerOfSection';
import {
  emptyUpsertPOFormValue,
  getCurrentEditMode,
  getPOFormValidationSchema,
  getPOFormValueFromResponse,
  getUpsertPOPayload,
} from 'src/containers/PurchaseOrderContainer/PO/helpers';
import {
  UpsertPOFormValue,
  UpsertPOFormikProps,
} from 'src/containers/PurchaseOrderContainer/PO/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { PO_ACTION, PO_DOCUMENT_TYPE, useGetPODetail, useProfile, useUpdatePO } from 'src/queries';
import { PO_CHANGE_FORM_NUMBER } from 'src/queries/POChange/enums';
import {
  isPOChangeAmountForm,
  isPOChangeAmountTerminatedForm,
  isPOChangeDescriptionForm,
  isPOChangeTotalCancellationForm,
} from 'src/queries/POChange/helpers';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import {
  isFAReviewMode,
  isFinalMode,
  isPiSuEditMode,
  isSaveAction,
  isViewOnlyMode,
} from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import { getUncontrolledInputFieldProps, handleShowErrorMsg } from 'src/utils';
import AuditInformation from '../../PO/AuditInformation';
import DeletePOWarning from '../../PO/DeletePOWarning';
import { PO_CHANGE_FORM_QUERY_KEY } from '../POChangeForm/enums';
import BreadcrumbsPOChangeForm from '../breadcrumbs';
import OriginalPurchaseInfo from './OriginalPurchaseInfo';
import PurchaseInfoChange from './PurchaseInfoChange';
import TableLineItemsPOChange from './TableLineItemsChange';
import { getPoChangeFormTitle } from './helpers';

const POChangeForm: FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  const { id } = useParams<{ id: string }>();

  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location]);
  const [allowRedirectWithoutWarning, setAllowRedirectWithoutWarning] = useState<boolean>(false);

  const scrollToParam = useMemo(
    () => query.get(PO_CHANGE_FORM_QUERY_KEY.SCROLL_TO) || null,
    [query]
  );
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

  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;
  const poStatus = useMemo(() => formData?.status, [formData?.status]);
  const poChangeFormNumber = useMemo(() => formData?.formNumber, [formData?.formNumber]);
  const currentPOMode = useMemo(
    () => getCurrentEditMode({ id, status: poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const isInPiSuEditMode = isPiSuEditMode(currentPOMode);
  const isInFAReviewMode = isFAReviewMode(currentPOMode);

  const isInChangeTotalCancellationForm = isPOChangeTotalCancellationForm(poChangeFormNumber);
  const isInChangeDescriptionForm = isPOChangeDescriptionForm(poChangeFormNumber);
  const isInChangeAmountForm = isPOChangeAmountForm(poChangeFormNumber);
  const isInChangeAmountTerminatedForm = isPOChangeAmountTerminatedForm(poChangeFormNumber);

  // all sections
  const disabledSection = isViewOnlyMode(currentPOMode) || isFinalMode(currentPOMode);

  // general info section
  const disabledGeneralInfoSection =
    isInChangeTotalCancellationForm || isInChangeAmountTerminatedForm;

  // line items and purchase info sections
  const isAllowUpdateAmount =
    (isInChangeAmountForm || isInChangeAmountTerminatedForm) &&
    (isInPiSuEditMode || isInFAReviewMode);
  const isAllowUpdateDescription =
    isInChangeDescriptionForm && (isInPiSuEditMode || isInFAReviewMode);
  const showAmountChangeSection = isInChangeAmountForm || isInChangeAmountTerminatedForm;

  // additional form sections
  const isAllowUpdateAdditionalForm = isAllowUpdateAmount || isAllowUpdateDescription;

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

  const isLoading = updatePOLoading;

  // Navigate to submitted PO success page
  useEffect(() => {
    if (isUpdatePOSuccess && !isLoading) {
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
  }, [isUpdatePOSuccess]);

  /* INIT DATA */
  useEffect(() => {
    if (!isImmutableFormData) {
      onGetPOById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onGetPOById]);

  // mark as form no longer is immutable.
  // The next time component did mount:
  //  * if isImmutableFormData is true => it will reset to initial empty form
  //  * if isImmutableFormData is false => it will get the formData from Redux to initial form
  useEffect(() => {
    return () => {
      onSetIsImmutableFormData(false);
    };
  }, [onSetIsImmutableFormData]);

  const initialFormValue = useMemo(() => formData || emptyUpsertPOFormValue, [formData]);

  const validationSchema = useMemo(
    () => getPOFormValidationSchema({ action: formAction }),
    [formAction]
  );

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
    validationSchema: validationSchema,
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

  const renderForm = () => {
    return (
      <>
        <SectionLayout header={<HeaderOfSection />}>
          <GeneralInfo
            formikProps={formikProps}
            disabled={disabledSection || disabledGeneralInfoSection}
            currentPOMode={currentPOMode}
            documentType={PO_DOCUMENT_TYPE.PO_CHANGE}
          />

          {isInChangeAmountTerminatedForm && (
            <Stack
              bgcolor={COLOR_CODE.WARNING}
              sx={{ p: 1, mt: 2, flexDirection: 'row', alignItems: 'center' }}
            >
              <AiFillWarning color={COLOR_CODE.WHITE} fontSize={24} />
              <Typography variant="body2" color={COLOR_CODE.WHITE} sx={{ ml: 1 }}>
                Internal Purposes Only - Do not send to vendor
              </Typography>
            </Stack>
          )}
        </SectionLayout>

        {!isInChangeTotalCancellationForm && (
          <SectionLayout sx={{ p: 0, border: 'none' }}>
            <Accordion title="Original Order">
              <TableLineItemsPOChange
                formikProps={formikProps}
                disabled
                currentPOMode={currentPOMode}
                isOriginItems={true}
                allowUpdateDescription={false}
                allowUpdateInfoAndAmount={false}
              />
              <Box mt={2}>
                <OriginalPurchaseInfo formikProps={formikProps} />
              </Box>
            </Accordion>
          </SectionLayout>
        )}

        {!isInChangeTotalCancellationForm && (
          <Typography
            bgcolor={'white'}
            border={COLOR_CODE.DEFAULT_BORDER}
            variant="h5"
            sx={{ py: 1, px: 3, mt: 2, mb: -2 }}
          >
            Change Order to Read
          </Typography>
        )}

        <SectionLayout>
          <TableLineItemsPOChange
            formikProps={formikProps}
            disabled={disabledSection}
            currentPOMode={currentPOMode}
            isOriginItems={isInChangeTotalCancellationForm ? true : false}
            allowUpdateInfoAndAmount={isAllowUpdateAmount}
            allowUpdateDescription={isAllowUpdateAmount || isAllowUpdateDescription}
          />
        </SectionLayout>

        <SectionLayout>
          <PurchaseInfoChange
            formikProps={formikProps}
            disabled={disabledSection}
            currentPOMode={currentPOMode}
            allowUpdateAmount={isAllowUpdateAmount}
            showAmountChangeSection={showAmountChangeSection}
          />
        </SectionLayout>

        <SectionLayout>
          <AdditionalForms
            formikProps={formikProps}
            disabled={disabledSection || !isAllowUpdateAdditionalForm}
          />
        </SectionLayout>

        <SectionLayout>
          <AuthorizedBy formikProps={formikProps} disabled={disabledSection} />
        </SectionLayout>

        <SectionLayout sx={{ p: 0, border: 'none' }}>
          <FileAttachments
            formikProps={formikProps}
            disabled={isViewOnlyMode(currentPOMode)}
            allowActionAfterFinalApproveOnly={isFinalMode(currentPOMode)}
          />
        </SectionLayout>

        <SectionLayout sx={{ p: 0, border: 'none' }}>
          <AuditInformation formikProps={formikProps} />
        </SectionLayout>

        <SectionLayout>
          <InternalComments formikProps={formikProps} disabled={disabledSection} />
        </SectionLayout>
      </>
    );
  };

  const handleConfirmCancel = () => {
    onSetFormData(null);
  };

  const blockCondition = (location: Location<string>) => {
    if (allowRedirectWithoutWarning) return false;

    if (location.pathname.includes(PATHS.createPurchaseOrders)) {
      onSetIsImmutableFormData(false);
      return true;
    }

    const acceptablePaths = [PATHS.poAdditionalForm, PATHS.poChangeForm];
    const isAcceptablePath = acceptablePaths.some((path) => location.pathname.includes(path));

    if (isAcceptablePath) {
      return false;
    }

    if (!isUpdatePOSuccess) {
      return isFormDirty;
    }
  };

  const hasPermission = true; //TODO: update when enhancement needed

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
            RCUH Purchase Order Change Form RCUH{' '}
            {getPoChangeFormTitle(poChangeFormNumber as PO_CHANGE_FORM_NUMBER)}
          </Typography>
          <Suspense fallback={<LoadingCommon />}>
            {!hasPermission ? (
              <SectionLayout>
                <NoPermission />
              </SectionLayout>
            ) : (
              <>
                {renderForm()}
                <ActionButtons
                  currentFormMode={currentPOMode}
                  formikProps={formikProps}
                  loading={isLoading}
                  disabled={isLoading}
                  showCloneDocument={false}
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

const POChangeFormWrapper: FC<Props> = ({ ...props }) => {
  return (
    <CustomErrorBoundary FallbackComponent={(props) => <ErrorWrapperPO {...props} />}>
      <Suspense
        fallback={
          <Box minHeight="80vh" p={4}>
            <LoadingCommon />
          </Box>
        }
      >
        <POChangeForm {...props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(POChangeFormWrapper);
