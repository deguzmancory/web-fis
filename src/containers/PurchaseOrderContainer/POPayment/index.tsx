import { Box, Container, Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Location } from 'history';
import { FC, Suspense, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { LoadingCommon } from 'src/components/common';
import ActionButtons from 'src/containers/PurchaseOrderContainer/PO/ActionButtons';
import ErrorWrapperPO from 'src/containers/PurchaseOrderContainer/PO/ErrorWrapper/index.';
import GeneralInfo from 'src/containers/PurchaseOrderContainer/PO/GeneralInfo';
import { SUBMITTED_PO_QUERY } from 'src/containers/PurchaseOrderContainer/PO/enums';
import HeaderOfSection from 'src/containers/PurchaseOrderContainer/PO/headerOfSection';
import { getCurrentEditMode } from 'src/containers/PurchaseOrderContainer/PO/helpers';
import SectionLayout from 'src/containers/shared/SectionLayout';
import {
  PO_ACTION,
  PO_DOCUMENT_TYPE,
  useGetPOPaymentDetail,
  useGetPOPmtRemainingBalance,
  useProfile,
  useUpdatePOPayment,
} from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import {
  isCUReviewMode,
  isFinalMode,
  isSaveAction,
  isViewOnlyMode,
} from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import { getUncontrolledInputFieldProps, handleShowErrorMsg } from 'src/utils';
import FileAttachments from '../PO/FileAttachments';
import InternalComments from '../PO/InternalComments';
import PurchaseInfo from '../PO/PurchaseInfo';
import TableLineItems from '../PO/TableLineItems';
import EquipmentInventoriesV2 from './EquipmentInventoriesV2';
import PaymentAuthorizedBy from './PaymentAuthorizedBy';
import TablePaymentRemainingBalanceLineItems from './PaymentBalanceLineItems';
import PaymentGeneralInfo from './PaymentGeneralInfo';
import PaymentLineItems from './PaymentLineItems';
import PaymentRemittanceInfo from './PaymentRemittanceInfo';
import ReceiptAndPaymentType from './ReceiptAndPaymentType';
import BreadcrumbsPOPayment from './breadcrumbs';
import {
  emptyUpdatePOPaymentFormValue,
  getPOPaymentFormValidationSchema,
  getPOPaymentFormValueFromResponse,
  getUpdatePOPaymentPayload,
} from './helpers';
import { UpdatePOPaymentFormValue, UpdatePOPaymentFormikProps } from './types';
import DeletePOPaymentWarning from './DeletePOPaymentWarning';
import AuditInformation from '../PO/AuditInformation';

const POPayment: FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  const { id } = useParams<{ id: string }>();
  const [allowRedirectWithoutWarning, setAllowRedirectWithoutWarning] = useState<boolean>(false);

  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;
  const poStatus = useMemo(() => formData?.status, [formData?.status]);
  const currentPOMode = useMemo(
    () => getCurrentEditMode({ id, status: poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const disabledSection =
    isViewOnlyMode(currentPOMode) || isFinalMode(currentPOMode) || isCUReviewMode(currentPOMode);

  const { profile } = useProfile();
  const { onGetRemainingBalance } = useGetPOPmtRemainingBalance({
    // onError: (error: Error) => handleShowErrorMsg(error), //TODO: Tuyen Tran: uncomment after BE integrate
    id: id,
  });
  const { onGetPOPaymentById, handleInvalidatePOPaymentDetail } = useGetPOPaymentDetail({
    id: id,
    onSuccess: async (data) => {
      const { data: remainingBalanceResponse } = await onGetRemainingBalance();

      const formValue: UpdatePOPaymentFormValue = getPOPaymentFormValueFromResponse({
        profile,
        remainingBalanceResponse,
        poPaymentResponse: data,
      });

      onSetFormData<UpdatePOPaymentFormValue>(formValue);
    },
    onError: (error) => {
      handleShowErrorMsg(error);
    },
    suspense: true,
  });
  const {
    updatePOPayment,
    data: updatePOPaymentResponse,
    isLoading: updatePOPaymentLoading,
    isSuccess: isUpdatePOPaymentSuccess,
  } = useUpdatePOPayment({
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

  const isLoading = updatePOPaymentLoading;

  // Navigate to submitted PO success page
  useEffect(() => {
    if (isUpdatePOPaymentSuccess && !isLoading) {
      const responseData = updatePOPaymentResponse;

      switch (formAction) {
        case PO_ACTION.SAVE: {
          Toastify.success(`Saved form successfully.`);
          Navigator.navigate(`${PATHS.poPaymentForm}/${responseData.data.id}`);
          return;
        }
        case PO_ACTION.SUBMIT: {
          Navigator.navigate(
            `${PATHS.submittedPurchaseOrder}/${responseData.data.id}?${SUBMITTED_PO_QUERY.PO_NUMBER}=${responseData.data.number}&${SUBMITTED_PO_QUERY.DOCUMENT_TYPE}=${PO_DOCUMENT_TYPE.PO_PAYMENT}`
          );
          return;
        }

        case PO_ACTION.APPROVE: {
          Toastify.success(`Approved successfully.`);
          handleInvalidatePOPaymentDetail();
          onGetPOPaymentById();
          return;
        }

        case PO_ACTION.DISAPPROVE: {
          Toastify.success(`Disapproved successfully.`);
          handleInvalidatePOPaymentDetail();
          onGetPOPaymentById();
          return;
        }

        case PO_ACTION.ADDITIONAL_INFO: {
          Toastify.success(`Request more info successfully.`);
          handleInvalidatePOPaymentDetail();
          onGetPOPaymentById();
          return;
        }

        default: {
          handleInvalidatePOPaymentDetail();
          onGetPOPaymentById();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdatePOPaymentSuccess]);

  /* INIT DATA */
  useEffect(() => {
    if (!isImmutableFormData) {
      onGetPOPaymentById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onGetPOPaymentById]);

  // mark as form no longer is immutable.
  // The next time component did mount:
  //  * if isImmutableFormData is true => it will reset to initial empty form
  //  * if isImmutableFormData is false => it will get the formData from Redux to initial form
  useEffect(() => {
    return () => {
      onSetIsImmutableFormData(false);
    };
  }, [onSetIsImmutableFormData]);

  const initialFormValue = useMemo(() => formData || emptyUpdatePOPaymentFormValue, [formData]);

  const validationSchema = useMemo(
    () => getPOPaymentFormValidationSchema({ action: formAction }),
    [formAction]
  );

  const handleFormSubmit = (values: UpdatePOPaymentFormValue) => {
    const editPOPayload = getUpdatePOPaymentPayload({ formValues: values, action: values.action });
    updatePOPayment(editPOPayload);
  };

  const {
    values,
    errors,
    touched,
    dirty: isFormDirty,
    submitCount,
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    handleSubmit,
    validateForm,
  } = useFormik<UpdatePOPaymentFormValue>({
    initialValues: initialFormValue,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  const formikProps: UpdatePOPaymentFormikProps = {
    values,
    errors,
    touched,
    dirty: isFormDirty,
    submitCount,
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
          <PaymentGeneralInfo
            formikProps={formikProps}
            disabled={disabledSection}
            currentPOMode={currentPOMode}
          />
        </SectionLayout>

        <SectionLayout>
          <GeneralInfo
            title={'PURCHASE ORDER MAKING PAYMENT ON:'}
            formikProps={formikProps}
            disabled
            currentPOMode={currentPOMode}
            documentType={PO_DOCUMENT_TYPE.PO_PAYMENT}
          />
        </SectionLayout>

        <SectionLayout>
          <TableLineItems formikProps={formikProps} disabled currentPOMode={currentPOMode} />
        </SectionLayout>

        <SectionLayout>
          <PurchaseInfo formikProps={formikProps} disabled currentPOMode={currentPOMode} />
        </SectionLayout>

        <Grid container columnSpacing={2}>
          <Grid item xs={12} md={6}>
            <SectionLayout>
              <ReceiptAndPaymentType
                formikProps={formikProps}
                disabled={disabledSection}
                currentPOMode={currentPOMode}
              />
            </SectionLayout>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionLayout>
              <PaymentAuthorizedBy
                formikProps={formikProps}
                disabled={disabledSection}
                currentPOMode={currentPOMode}
              />
            </SectionLayout>
          </Grid>
        </Grid>

        <Grid container columnSpacing={2}>
          <Grid item xs={12} md={6}>
            <SectionLayout sx={{ p: 1 }}>
              <PaymentLineItems
                formikProps={formikProps}
                disabled={disabledSection}
                currentPOMode={currentPOMode}
              />
            </SectionLayout>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionLayout sx={{ p: 1 }}>
              <TablePaymentRemainingBalanceLineItems
                formikProps={formikProps}
                disabled={disabledSection}
                currentPOMode={currentPOMode}
              />
            </SectionLayout>
          </Grid>
        </Grid>

        <SectionLayout>
          <PaymentRemittanceInfo
            formikProps={formikProps}
            disabled={disabledSection}
            currentPOMode={currentPOMode}
          />
        </SectionLayout>

        <SectionLayout sx={{ p: 0, border: 'none' }}>
          <EquipmentInventoriesV2
            formikProps={formikProps}
            disabled={disabledSection}
            currentPOMode={currentPOMode}
          />
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

    const acceptablePaths = [PATHS.poPaymentForm];
    const isAcceptablePath = acceptablePaths.some((path) => location.pathname.includes(path));

    if (isAcceptablePath) {
      return false;
    }

    if (!isUpdatePOPaymentSuccess) {
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
          <BreadcrumbsPOPayment />

          <Typography mt={2} variant="h2">
            RCUH Purchase Order Payment
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
                  showVendorPrintMode={false}
                  warningDeleteContainer={
                    <DeletePOPaymentWarning
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

const POPaymentWrapper: FC<Props> = ({ ...props }) => {
  return (
    <CustomErrorBoundary FallbackComponent={(props) => <ErrorWrapperPO {...props} />}>
      <Suspense
        fallback={
          <Box minHeight="80vh" p={4}>
            <LoadingCommon />
          </Box>
        }
      >
        <POPayment {...props} />
      </Suspense>
    </CustomErrorBoundary>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState<UpdatePOPaymentFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  formAction: state.form.poFormAction,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(POPaymentWrapper);
