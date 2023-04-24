import { Box, Container, Stack, Typography } from '@mui/material';
import { FC, useMemo, Suspense, useEffect, useLayoutEffect, useState, lazy } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import { LoadingCommon } from 'src/components/common';
import { getCurrentEditMode } from 'src/containers/PurchaseOrderContainer/PO/helpers';
import { PO_ACTION, useProfile } from 'src/queries';
import { isFinalMode, isSaveAction, isViewOnlyMode } from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import ErrorNonPOWrapper from '../shared/ErrorWrapper/index.';
import { UpsertNonEmployeeTravelFormValue, UpsertNonEmployeeTravelFormikProps } from './types';
import {
  getErrorMessage,
  getErrorMessageFromResponse,
  getUncontrolledInputFieldProps,
  handleShowErrorMsg,
} from 'src/utils';
import { useGetNonEmployeeTravelDetail } from 'src/queries/NonPOPayment/NonEmployeeTravel/useGetNonEmployeeTravelDetail';
import { useCreateNonEmployeeTravel } from 'src/queries/NonPOPayment/NonEmployeeTravel/useCreateNonEmployeeTravel';
import { useUpdateNonEmployeeTravel } from 'src/queries/NonPOPayment/NonEmployeeTravel/useUpdateNonEmployeeTravel';
import {
  getInitialNonEmployeeTravelFormValue,
  getNonEmployeeTravelFormValueFromResponse,
  getUpsertNonEmployeeTravelPayload,
} from './helpers/formValues';
import { PATHS } from 'src/appConfig/paths';
import { SUBMITTED_NON_PO_PAYMENT_QUERY } from '../shared/SubmittedPO/enums';
import { emptyUpsertNonEmployeeTravelFormValue } from './helpers/constants';
import { useFormik } from 'formik';
import { Location } from 'history';
import { getNonEmployeeTravelFormValidationSchema } from './helpers/validationSchema';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from 'src/queries/NonPOPayment';
import Prompt from 'src/services/Prompt';
import BreadcrumbsNonPOForm from '../shared/Breadcrumb';
import Header from './Header';
import SectionLayout from 'src/containers/shared/SectionLayout';
import NoPermission from 'src/components/NoPermission';
import HeaderOfSection from '../shared/HeaderOfSection';
import SelectPayeeCategory from './SelectPayeeCategory';
import GeneralInfo from './GeneralInfo';
import ActionButtons from 'src/containers/PurchaseOrderContainer/PO/ActionButtons';
import DeleteWarning from './DeleteWarning';
import TripItinerary from './TripItineraries';
import PartialDayTable from './PartialDayTable';
import TravelExpenditures from './TravelExpenditures';
import ProjectItems from '../shared/ProjectItems';
import { NON_EMPLOYEE_TRAVEL_FORM_KEY } from './enums';
import ReceiptCertification from './ReceiptCertification';
import BusinessPurposeDetails from './BusinessPurposeDetails';
import FormErrorSection from 'src/containers/shared/FormErrorSection';
import { isInGroup1Payee } from 'src/queries/NonPOPayment/NonEmployeeTravel/helpers';
import AuditInformation from '../shared/AuditInformation';
import InternalComments from '../shared/InternalComments';

const FileAttachments = lazy(() => import('./FileAttachments'));

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
  const currentNonEmployeeTravelMode = useMemo(
    () => getCurrentEditMode({ id, status: poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const disabledSection =
    isViewOnlyMode(currentNonEmployeeTravelMode) || isFinalMode(currentNonEmployeeTravelMode);
  const { profile } = useProfile();

  const { onGetNonEmployeeTravelById, handleInvalidateNonEmployeeTravelDetail } =
    useGetNonEmployeeTravelDetail({
      id: id,
      onSuccess: (data) => {
        const formValue: UpsertNonEmployeeTravelFormValue =
          getNonEmployeeTravelFormValueFromResponse({
            response: data,
            profile,
          });

        onSetFormData<UpsertNonEmployeeTravelFormValue>(formValue);
      },
      onError: (error) => {
        handleShowErrorMsg(error);
      },
      suspense: true,
    });
  const {
    createNonEmployeeTravel,
    data: createNonEmployeeTravelResponse,
    isLoading: createNonEmployeeTravelLoading,
    isSuccess: isCreateNonEmployeeTravelSuccess,
  } = useCreateNonEmployeeTravel({
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
    updateNonEmployeeTravel,
    data: updateNonEmployeeTravelResponse,
    isLoading: updateNonEmployeeTravelLoading,
    isSuccess: isUpdateNonEmployeeTravelSuccess,
  } = useUpdateNonEmployeeTravel({
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

  const isLoading = createNonEmployeeTravelLoading || updateNonEmployeeTravelLoading;

  // Navigate to submitted PO success page
  useEffect(() => {
    if ((isCreateNonEmployeeTravelSuccess || isUpdateNonEmployeeTravelSuccess) && !isLoading) {
      const responseData = isEditMode
        ? updateNonEmployeeTravelResponse
        : createNonEmployeeTravelResponse;

      switch (formAction) {
        case PO_ACTION.SAVE: {
          Toastify.success(`Saved form successfully.`);
          Navigator.navigate(`${PATHS.nonEmployeeTravelPaymentDetail}/${responseData.data.id}`);
          return;
        }
        case PO_ACTION.SUBMIT: {
          Navigator.navigate(
            `${PATHS.submittedNonPOPayment}/${responseData.data.id}?${SUBMITTED_NON_PO_PAYMENT_QUERY.NUMBER}=${responseData.data.requestNumber}&${SUBMITTED_NON_PO_PAYMENT_QUERY.DOCUMENT_TYPE}=${NON_PO_PAYMENT_DOCUMENT_TYPE.NON_EMPLOYEE_TRAVEL_PAYMENT}`
          );
          return;
        }

        case PO_ACTION.APPROVE: {
          Toastify.success(`Approved successfully.`);
          handleInvalidateNonEmployeeTravelDetail();
          onGetNonEmployeeTravelById();
          return;
        }

        case PO_ACTION.DISAPPROVE: {
          Toastify.success(`Disapprove successfully.`);
          handleInvalidateNonEmployeeTravelDetail();
          onGetNonEmployeeTravelById();
          return;
        }

        case PO_ACTION.ADDITIONAL_INFO: {
          Toastify.success(`Request more info successfully.`);
          handleInvalidateNonEmployeeTravelDetail();
          onGetNonEmployeeTravelById();
          return;
        }

        default: {
          handleInvalidateNonEmployeeTravelDetail();
          onGetNonEmployeeTravelById();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateNonEmployeeTravelSuccess, isUpdateNonEmployeeTravelSuccess]);

  /* INIT DATA */
  // get initial data when first time mounted

  // create mode
  // using useLayoutEffect to avoid flash at first time render
  useLayoutEffect(() => {
    const isInitialEmptyForm = !isEditMode && !isImmutableFormData;

    if (isInitialEmptyForm) {
      const initialPOFormValue = getInitialNonEmployeeTravelFormValue({ profile });
      onSetFormData<UpsertNonEmployeeTravelFormValue>(initialPOFormValue);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, profile, onSetFormData]);

  // edit mode
  // using useEffect for fetch data from api
  useEffect(() => {
    if (isEditMode && !isImmutableFormData) {
      onGetNonEmployeeTravelById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, onGetNonEmployeeTravelById]);

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

  const handleFormSubmit = (values: UpsertNonEmployeeTravelFormValue) => {
    if (isEditMode) {
      const editNonEmployeeTravelPayload = getUpsertNonEmployeeTravelPayload({
        formValues: values,
        action: values.action,
      });
      updateNonEmployeeTravel(editNonEmployeeTravelPayload);
    } else {
      const createNonEmployeeTravelPayload = getUpsertNonEmployeeTravelPayload({
        formValues: values,
        action: values.action,
      });
      createNonEmployeeTravel(createNonEmployeeTravelPayload);
    }
  };

  const initialFormValue = useMemo(
    () => formData || emptyUpsertNonEmployeeTravelFormValue,
    [formData]
  );

  const validationSchema = useMemo(
    () => getNonEmployeeTravelFormValidationSchema({ action: formAction }),
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
  } = useFormik<UpsertNonEmployeeTravelFormValue>({
    initialValues: initialFormValue,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  const formikProps: UpsertNonEmployeeTravelFormikProps = {
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
      PATHS.createPurchaseOrders,
      PATHS.purchaseOrderDetail,
      PATHS.poAdditionalForm,
      PATHS.addVendorRegistration,
    ];
    const isAcceptablePath = acceptablePaths.some((path) => location.pathname.includes(path));

    if (isAcceptablePath) {
      return false;
    }

    const success = isEditMode
      ? isUpdateNonEmployeeTravelSuccess
      : isCreateNonEmployeeTravelSuccess;

    if (!success) {
      return isFormDirty;
    }
  };

  const showItineraryAndExpenditureSections = useMemo(
    () => !values.payeeCategory || isInGroup1Payee(values.payeeCategory),
    [values.payeeCategory]
  );

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
                <SectionLayout header={<HeaderOfSection />}>
                  <SelectPayeeCategory
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentMode={currentNonEmployeeTravelMode}
                  />
                </SectionLayout>
                <SectionLayout>
                  <GeneralInfo
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentMode={currentNonEmployeeTravelMode}
                  />
                </SectionLayout>
                {showItineraryAndExpenditureSections && (
                  <>
                    <SectionLayout sx={{ p: 0 }}>
                      <TripItinerary
                        formikProps={formikProps}
                        disabled={disabledSection}
                        currentMode={currentNonEmployeeTravelMode}
                      />
                    </SectionLayout>
                    <SectionLayout sx={{ p: 0, border: 'none' }}>
                      <PartialDayTable />
                    </SectionLayout>
                    <SectionLayout>
                      <TravelExpenditures
                        formikProps={formikProps}
                        disabled={disabledSection}
                        currentMode={currentNonEmployeeTravelMode}
                      />
                    </SectionLayout>
                  </>
                )}
                <SectionLayout>
                  <ProjectItems
                    title={'PROJECT(S) TO BE CHARGED'}
                    formikProps={formikProps}
                    disabled={disabledSection}
                    projectItemsPrefix={NON_EMPLOYEE_TRAVEL_FORM_KEY.PROJECT_ITEMS}
                    totalPrefix={NON_EMPLOYEE_TRAVEL_FORM_KEY.PAYMENT_TOTAL}
                    showTotalError={false}
                    tableErrorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.PAYMENT_TOTAL)}
                  />
                </SectionLayout>
                <SectionLayout>
                  <ReceiptCertification
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentMode={currentNonEmployeeTravelMode}
                  />
                </SectionLayout>
                <SectionLayout>
                  <BusinessPurposeDetails
                    formikProps={formikProps}
                    disabled={disabledSection}
                    currentMode={currentNonEmployeeTravelMode}
                  />
                </SectionLayout>
                <SectionLayout sx={{ p: 0, border: 'none' }}>
                  {isEditMode ? (
                    <FileAttachments
                      formikProps={formikProps}
                      disabled={isViewOnlyMode(currentNonEmployeeTravelMode)}
                      allowActionAfterFinalApproveOnly={isFinalMode(currentNonEmployeeTravelMode)}
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
                  <InternalComments formikProps={formikProps} disabled={disabledSection} />
                </SectionLayout>

                <ActionButtons
                  currentFormMode={currentNonEmployeeTravelMode}
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

const NonEmployeeExpensePayment: FC<Props> = ({ ...props }) => {
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

const mapStateToProps = (state: IRootState<UpsertNonEmployeeTravelFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  formAction: state.form.poFormAction,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(NonEmployeeExpensePayment);
