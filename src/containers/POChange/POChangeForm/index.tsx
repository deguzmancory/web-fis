import { Box, Container, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Location } from 'history';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { Accordion, LoadingCommon } from 'src/components/common';
import ActionButtons from 'src/containers/PurchaseOrderContainer/ActionButtons';
import ErrorWrapperPO from 'src/containers/PurchaseOrderContainer/ErrorWrapper/index.';
import GeneralInfo from 'src/containers/PurchaseOrderContainer/GeneralInfo';
import { emptyUpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/constants';
import {
  PO_FORM_ELEMENT_ID,
  SUBMITTED_PO_QUERY,
} from 'src/containers/PurchaseOrderContainer/enums';
import HeaderOfSection from 'src/containers/PurchaseOrderContainer/headerOfSection';
import {
  getCurrentPOEditMode,
  getPOFormValidationSchema,
  getPOFormValueFromResponse,
  getUpsertPOPayload,
} from 'src/containers/PurchaseOrderContainer/helpers';
import {
  UpsertPOFormValue,
  UpsertPOFormikProps,
} from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { PO_ACTION, PO_DOCUMENT_TYPE, useGetPODetail, useProfile, useUpdatePO } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import {
  isFAReviewPOMode,
  isFinalPOMode,
  isPOChangeDocumentType,
  isPOSaveAction,
  isPiSuEditPOMode,
  isViewOnlyPOMode,
} from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import { getUncontrolledInputFieldProps, handleShowErrorMsg } from 'src/utils';
import { PO_CHANGE_FORM_QUERY_KEY } from '../POChangeForm/enums';
import BreadcrumbsPOChangeForm from '../breadcrumbs';
import { getPoChangeFormTitle } from './helpers';
import { PO_CHANGE_FORM_NUMBER } from 'src/queries/POChange/enums';
import OriginalPurchaseInfo from './OriginalPurchaseInfo';
import PurchaseInfo from './PurchaseInfo';
import TableLineItems from './TableLineItems';
import AdditionalForms from 'src/containers/PurchaseOrderContainer/AdditionalForms';
import {
  isPOChangeAmountForm,
  isPOChangeAmountTerminatedForm,
  isPOChangeDescriptionForm,
} from 'src/queries/POChange/helpers';
import AuthorizedBy from 'src/containers/PurchaseOrderContainer/AuthorizedBy';
import FileAttachments from 'src/containers/PurchaseOrderContainer/FileAttachments';
import AuditInformation from 'src/containers/PurchaseOrderContainer/AuditInformation';
import InternalComments from 'src/containers/PurchaseOrderContainer/InternalComments';

const POChangeForm: React.FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  // const formNumber = React.useMemo(
  //   () => query.get(PO_CHANGE_FORM_QUERY_KEY.FORM_NUMBER) || null,
  //   [query]
  // );
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

  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;
  const poStatus = React.useMemo(() => formData?.status, [formData?.status]);
  const poChangeFormNumber = React.useMemo(() => formData?.formNumber, [formData?.formNumber]);
  const currentPOMode = React.useMemo(
    () => getCurrentPOEditMode({ id, poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const disabledSection = isViewOnlyPOMode(currentPOMode) || isFinalPOMode(currentPOMode);

  const isPiSuEditMode = isPiSuEditPOMode(currentPOMode);
  const isFAReviewMode = isFAReviewPOMode(currentPOMode);

  const isInChangeDescriptionForm = isPOChangeDescriptionForm(poChangeFormNumber);
  const isInChangeAmountForm = isPOChangeAmountForm(poChangeFormNumber);
  const isInChangeAmountTerminatedForm = isPOChangeAmountTerminatedForm(poChangeFormNumber);

  const isAllowUpdateAmount =
    (isInChangeAmountForm || isInChangeAmountTerminatedForm) && (isPiSuEditMode || isFAReviewMode);
  const isAllowUpdateDescription = isInChangeDescriptionForm && (isFAReviewMode || isPiSuEditMode);
  const isAllowUpdateAdditionalForm = isAllowUpdateAmount || isAllowUpdateDescription;

  const showAmountChangeSection = isInChangeAmountForm || isInChangeAmountTerminatedForm;

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
    // suspense: true,
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

  const isLoading = updatePOLoading;

  // Navigate to submitted PO success page
  React.useEffect(() => {
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
    validationSchema: getPOFormValidationSchema,
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
            disabled={disabledSection}
            currentPOMode={currentPOMode}
          />
        </SectionLayout>
        <SectionLayout>
          <Accordion title="Original Order">
            <TableLineItems
              formikProps={formikProps}
              disabled
              currentPOMode={currentPOMode}
              filterOriginItemValue={true}
              allowUpdateDescription={false}
              allowUpdateInfoAndAmount={false}
            />
            <Box mt={2}>
              <OriginalPurchaseInfo formikProps={formikProps} />
            </Box>
          </Accordion>
        </SectionLayout>
        <SectionLayout>
          <TableLineItems
            formikProps={formikProps}
            disabled={disabledSection}
            currentPOMode={currentPOMode}
            filterOriginItemValue={false}
            allowUpdateInfoAndAmount={isAllowUpdateAmount}
            allowUpdateDescription={isAllowUpdateAmount || isAllowUpdateDescription}
          />
        </SectionLayout>
        <SectionLayout>
          <PurchaseInfo
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
        <SectionLayout>
          <FileAttachments
            formikProps={formikProps}
            disabled={isViewOnlyPOMode(currentPOMode)}
            allowActionAfterFinalApproveOnly={isFinalPOMode(currentPOMode)}
          />
        </SectionLayout>
        <SectionLayout>
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
    const acceptablePaths = [PATHS.poAdditionalForm, PATHS.poChangeForm];
    const isAcceptablePath = acceptablePaths.some((path) => location.pathname.includes(path));

    if (isAcceptablePath) {
      return false;
    }

    if (!isUpdatePOSuccess) {
      return isFormDirty;
    }
  };

  const hasPermission = true || isPOChangeDocumentType(values.documentType); //TODO: update when enhancement needed

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
                  currentPOMode={currentPOMode}
                  formikProps={formikProps}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </>
            )}
          </Suspense>
        </Container>
      </Box>
    </Prompt>
  );
};

const POChangeFormWrapper: React.FC<Props> = ({ ...props }) => {
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
