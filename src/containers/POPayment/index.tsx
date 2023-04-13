import { Box, Container, Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Location } from 'history';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { LoadingCommon } from 'src/components/common';
import ActionButtons from 'src/containers/PurchaseOrderContainer/ActionButtons';
import ErrorWrapperPO from 'src/containers/PurchaseOrderContainer/ErrorWrapper/index.';
import GeneralInfo from 'src/containers/PurchaseOrderContainer/GeneralInfo';
import { SUBMITTED_PO_QUERY } from 'src/containers/PurchaseOrderContainer/enums';
import HeaderOfSection from 'src/containers/PurchaseOrderContainer/headerOfSection';
import { getCurrentPOEditMode } from 'src/containers/PurchaseOrderContainer/helpers';
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
  isFinalPOMode,
  isPOSaveAction,
  isViewOnlyPOMode,
} from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import { getUncontrolledInputFieldProps, handleShowErrorMsg } from 'src/utils';
import AuditInformation from '../PurchaseOrderContainer/AuditInformation';
import FileAttachments from '../PurchaseOrderContainer/FileAttachments';
import InternalComments from '../PurchaseOrderContainer/InternalComments';
import PurchaseInfo from '../PurchaseOrderContainer/PurchaseInfo';
import TableLineItems from '../PurchaseOrderContainer/TableLineItems';
import EquipmentInventories from './EquipmentInventories';
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
} from './helpers';
import { UpdatePOPaymentFormValue, UpdatePOPaymentFormikProps } from './types';

const POPayment: React.FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
  formAction,
}) => {
  const { id } = useParams<{ id: string }>();

  const currentRole = RoleService.getCurrentRole() as ROLE_NAME;
  const poStatus = React.useMemo(() => formData?.status, [formData?.status]);
  const currentPOMode = React.useMemo(
    () => getCurrentPOEditMode({ id, poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const disabledSection = isViewOnlyPOMode(currentPOMode) || isFinalPOMode(currentPOMode);

  const { profile } = useProfile();
  const { onGetRemainingBalance } = useGetPOPmtRemainingBalance({
    onError: (error: Error) => handleShowErrorMsg(error),
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
    // updatePOPayment,
    data: updatePOPaymentResponse,
    isLoading: updatePOPaymentLoading,
    isSuccess: isUpdatePOPaymentSuccess,
  } = useUpdatePOPayment({
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

  const isLoading = updatePOPaymentLoading;

  // Navigate to submitted PO success page
  React.useEffect(() => {
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
          Toastify.success(`Approve successfully.`);
          handleInvalidatePOPaymentDetail();
          onGetPOPaymentById();
          return;
        }

        case PO_ACTION.DISAPPROVE: {
          Toastify.success(`Disapprove successfully.`);
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
  React.useEffect(() => {
    if (!isImmutableFormData) {
      onGetPOPaymentById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onGetPOPaymentById]);

  // mark as form no longer is immutable.
  // The next time component did mount:
  //  * if isImmutableFormData is true => it will reset to initial empty form
  //  * if isImmutableFormData is false => it will get the formData from Redux to initial form
  React.useEffect(() => {
    return () => {
      onSetIsImmutableFormData(false);
    };
  }, [onSetIsImmutableFormData]);

  const initialFormValue = React.useMemo(
    () => formData || emptyUpdatePOPaymentFormValue,
    [formData]
  );

  const validationSchema = React.useMemo(
    () => getPOPaymentFormValidationSchema({ action: formAction }),
    [formAction]
  );

  const handleFormSubmit = (values: UpdatePOPaymentFormValue) => {
    // const editPOPayload = getUpsertPOPayload({ formValues: values, action: values.action });
    // updatePOPayment(editPOPayload);
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

        <SectionLayout sx={{ p: 0, border: 'none' }}>
          <PaymentRemittanceInfo
            formikProps={formikProps}
            disabled={disabledSection}
            currentPOMode={currentPOMode}
          />
        </SectionLayout>

        <SectionLayout>
          <EquipmentInventories
            formikProps={formikProps}
            disabled={disabledSection}
            currentPOMode={currentPOMode}
          />
        </SectionLayout>

        <SectionLayout sx={{ p: 0, border: 'none' }}>
          <FileAttachments
            formikProps={formikProps}
            disabled={isViewOnlyPOMode(currentPOMode)}
            allowActionAfterFinalApproveOnly={isFinalPOMode(currentPOMode)}
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
                  currentPOMode={currentPOMode}
                  formikProps={formikProps}
                  loading={isLoading}
                  disabled={isLoading}
                  documentType={PO_DOCUMENT_TYPE.PO_PAYMENT}
                />
              </>
            )}
          </Suspense>
        </Container>
      </Box>
    </Prompt>
  );
};

const POPaymentWrapper: React.FC<Props> = ({ ...props }) => {
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
