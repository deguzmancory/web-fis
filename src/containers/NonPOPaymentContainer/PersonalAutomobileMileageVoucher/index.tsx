import { Box, Container, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Location } from 'history';
import { FC, Suspense, useEffect, useLayoutEffect, useMemo, useState, lazy } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import { LoadingCommon } from 'src/components/common';
import { getCurrentEditMode } from 'src/containers/PurchaseOrderContainer/PO/helpers';
import { PO_ACTION, useProfile } from 'src/queries';
import {
  NON_PO_PAYMENT_DOCUMENT_TYPE,
  useCreatePersonalAutomobile,
  useUpdatePersonalAutomobile,
} from 'src/queries/NonPOPayment';
import {
  isCUReviewMode,
  isFAReviewMode,
  isFinalMode,
  isSaveAction,
  isViewOnlyMode,
} from 'src/queries/PurchaseOrders/helpers';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, RoleService, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import {
  getErrorMessage,
  getErrorMessageFromResponse,
  getUncontrolledInputFieldProps,
  handleShowErrorMsg,
} from 'src/utils';

import NoPermission from '../../../components/NoPermission';
import ActionButtons from '../../PurchaseOrderContainer/PO/ActionButtons';
import FormErrorSection from '../../shared/FormErrorSection';
import SectionLayout from '../../shared/SectionLayout';
import DeleteWarning from '../AuthorizationForPayment/DeleteWarning';
import BreadcrumbsNonPOForm from '../shared/Breadcrumb';
import ErrorNonPOWrapper from '../shared/ErrorWrapper/index.';
import HeaderOfSection from '../shared/HeaderOfSection';
import ProjectItems from '../shared/ProjectItems';
import { SUBMITTED_NON_PO_PAYMENT_QUERY } from '../shared/SubmittedNonPO/enums';
import AuthorizationSignatures from './AuthorizationSignatures';
import GeneralInfo from './GeneralInfo';
import Header from './Header';
import TripInfos from './TripInfos';
import { PERSONAL_AUTOMOBILE_FORM_KEY } from './enums';
import { personalAutomobileFormInitialValue } from './helpers/constants';
import {
  getInitialPersonalAutomobileFormValue,
  getPersonalAutomobileFormValueFromResponse,
  getUpsertPersonalAutomobileMileageVoucherPayload,
} from './helpers/formValues';
import { getPersonalAutomobileFormValidationSchema } from './helpers/validationSchema';
import { PersonalAutomobileFormValue, PersonalAutomobileFormikProps } from './types';
import InternalComments from '../shared/InternalComments';
import RemittanceTableLineItems from '../shared/Remittance/TableLineItems';
import RemittanceQuestions from '../shared/Remittance/QuestionOnRemittance';
import { useGetPersonalAutomobileDetail } from 'src/queries/NonPOPayment/PersonalAuto/useGetPersonalAutoDetail';

const FileAttachments = lazy(() => import('./FileAttachments'));
const AuditInformation = lazy(() => import('../shared/AuditInformation'));

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
  const currentPersonalAutomobileMode = useMemo(
    () => getCurrentEditMode({ id, status: poStatus, currentRole }),
    [id, poStatus, currentRole]
  );
  const disabledSection =
    isViewOnlyMode(currentPersonalAutomobileMode) || isFinalMode(currentPersonalAutomobileMode);

  const isReviewMode =
    isFAReviewMode(currentPersonalAutomobileMode) || isCUReviewMode(currentPersonalAutomobileMode);

  const { profile } = useProfile();

  const { onGetPersonalAutoById, handleInvalidatePersonalAutomobileDetail } =
    useGetPersonalAutomobileDetail({
      id,
      onSuccess: (data) => {
        const formValue: PersonalAutomobileFormValue = getPersonalAutomobileFormValueFromResponse({
          response: data,
          profile,
        });

        onSetFormData<PersonalAutomobileFormValue>(formValue);
      },
      onError: (error) => {
        handleShowErrorMsg(error);
      },
      suspense: true,
    });

  const {
    createPersonalAutomobile,
    data: createPersonalAutomobileResponse,
    isLoading: createPersonalAutomobileLoading,
    isSuccess: isCreatePersonalAutomobileSuccess,
  } = useCreatePersonalAutomobile({
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
    updatePersonalAutomobile,
    data: updatePersonalAutomobileResponse,
    isLoading: updatePersonalAutomobileLoading,
    isSuccess: isUpdatePersonalAutomobileSuccess,
  } = useUpdatePersonalAutomobile({
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

  const isLoading = createPersonalAutomobileLoading || updatePersonalAutomobileLoading;

  // Navigate to submitted PO success page
  useEffect(() => {
    if ((isCreatePersonalAutomobileSuccess || isUpdatePersonalAutomobileSuccess) && !isLoading) {
      const responseData = isEditMode
        ? updatePersonalAutomobileResponse
        : createPersonalAutomobileResponse;

      switch (formAction) {
        case PO_ACTION.SAVE: {
          Toastify.success(`Saved form successfully.`);
          Navigator.navigate(`${PATHS.personalAutoPaymentDetail}/${responseData.data.id}`);
          return;
        }
        case PO_ACTION.SUBMIT: {
          Navigator.navigate(
            `${PATHS.submittedNonPOPayment}/${responseData.data.id}?${SUBMITTED_NON_PO_PAYMENT_QUERY.NUMBER}=${responseData.data.requestNumber}&${SUBMITTED_NON_PO_PAYMENT_QUERY.DOCUMENT_TYPE}=${NON_PO_PAYMENT_DOCUMENT_TYPE.PERSONAL_AUTO_PAYMENT}`
          );
          return;
        }

        case PO_ACTION.APPROVE: {
          Toastify.success(`Approved successfully.`);
          handleInvalidatePersonalAutomobileDetail();
          onGetPersonalAutoById();
          return;
        }

        case PO_ACTION.DISAPPROVE: {
          Toastify.success(`Disapproved successfully.`);
          handleInvalidatePersonalAutomobileDetail();
          onGetPersonalAutoById();
          return;
        }

        case PO_ACTION.ADDITIONAL_INFO: {
          Toastify.success(`Request more info successfully.`);
          handleInvalidatePersonalAutomobileDetail();
          onGetPersonalAutoById();
          return;
        }

        default: {
          handleInvalidatePersonalAutomobileDetail();
          onGetPersonalAutoById();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatePersonalAutomobileSuccess, isUpdatePersonalAutomobileSuccess]);

  /* INIT DATA */
  // get initial data when first time mounted

  // create mode
  // using useLayoutEffect to avoid flash at first time render
  useLayoutEffect(() => {
    const isInitialEmptyForm = !isEditMode && !isImmutableFormData;

    if (isInitialEmptyForm) {
      const initialPOFormValue = getInitialPersonalAutomobileFormValue({ profile });
      onSetFormData<PersonalAutomobileFormValue>(initialPOFormValue);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, profile, onSetFormData]);

  // edit mode
  // using useEffect for fetch data from api
  useEffect(() => {
    if (isEditMode && !isImmutableFormData) {
      onGetPersonalAutoById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, onGetPersonalAutoById]);

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

  const handleFormSubmit = (values: PersonalAutomobileFormValue) => {
    if (isEditMode) {
      const editPersonalAutomobilePayload = getUpsertPersonalAutomobileMileageVoucherPayload({
        formValues: values,
        action: values.action,
      });
      updatePersonalAutomobile(editPersonalAutomobilePayload);
    } else {
      const createPersonalAutomobilePayload = getUpsertPersonalAutomobileMileageVoucherPayload({
        formValues: values,
        action: values.action,
      });
      createPersonalAutomobile(createPersonalAutomobilePayload);
    }
  };

  const initialFormValue = useMemo(
    () => formData || personalAutomobileFormInitialValue,
    [formData]
  );

  const validationSchema = useMemo(
    () => getPersonalAutomobileFormValidationSchema({ action: formAction }),
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
  } = useFormik<PersonalAutomobileFormValue>({
    initialValues: initialFormValue,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  const formikProps: PersonalAutomobileFormikProps = {
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
      ? isUpdatePersonalAutomobileSuccess
      : isCreatePersonalAutomobileSuccess;

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
                <SectionLayout
                  header={
                    <HeaderOfSection
                      documentType={NON_PO_PAYMENT_DOCUMENT_TYPE.PERSONAL_AUTO_PAYMENT}
                    />
                  }
                >
                  <GeneralInfo
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                    currentMode={currentPersonalAutomobileMode}
                  />
                </SectionLayout>
                <SectionLayout>
                  <TripInfos
                    title={'ITEMIZED TRIP INFORMATION'}
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                    tripItemsPrefix={PERSONAL_AUTOMOBILE_FORM_KEY.TRIP_INFOS}
                    showTotalError={false}
                    tableErrorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.PAYMENT_TOTAL)}
                    {...{
                      totalMilesPrefix: PERSONAL_AUTOMOBILE_FORM_KEY.TOTAL_MILES,
                      mileageRatePrefix: PERSONAL_AUTOMOBILE_FORM_KEY.MILEAGE_RATE,
                      totalMileageClaimPrefix: PERSONAL_AUTOMOBILE_FORM_KEY.TOTAL_MILEAGE_RATE,
                      totalParkingFeesPrefix: PERSONAL_AUTOMOBILE_FORM_KEY.TOTAL_PARKING,
                      totalMilesParkingPrefix: PERSONAL_AUTOMOBILE_FORM_KEY.TOTAL_MILES_PARKING,
                      companyPrefix: PERSONAL_AUTOMOBILE_FORM_KEY.COMPANY,
                      policyPrefix: PERSONAL_AUTOMOBILE_FORM_KEY.POLICY_NUMBER,
                      expirationDatePrefix: PERSONAL_AUTOMOBILE_FORM_KEY.EXPIRATION_DATE,
                    }}
                  />
                </SectionLayout>

                <SectionLayout>
                  <ProjectItems
                    title={'PROJECT(S) TO BE CHARGED'}
                    formikProps={formikProps}
                    projectItemsPrefix={PERSONAL_AUTOMOBILE_FORM_KEY.PROJECT_LINE_ITEMS}
                    disabled={disabledSection || isReviewMode}
                    totalPrefix={PERSONAL_AUTOMOBILE_FORM_KEY.PAYMENT_TOTAL}
                    showTotalError={false}
                    tableErrorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.PAYMENT_TOTAL)}
                  />
                </SectionLayout>
                <SectionLayout>
                  <AuthorizationSignatures
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                    currentMode={currentPersonalAutomobileMode}
                  />
                </SectionLayout>

                <SectionLayout>
                  <RemittanceTableLineItems
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                    disableReferenceNumber
                  />
                  <RemittanceQuestions
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                  />
                </SectionLayout>

                <SectionLayout sx={{ p: 0, border: 'none' }}>
                  {isEditMode ? (
                    <FileAttachments
                      formikProps={formikProps}
                      disabled={isViewOnlyMode(currentPersonalAutomobileMode)}
                      allowActionAfterFinalApproveOnly={isFinalMode(currentPersonalAutomobileMode)}
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
                  <InternalComments
                    formikProps={formikProps}
                    disabled={disabledSection || isReviewMode}
                  />
                </SectionLayout>

                <ActionButtons
                  currentFormMode={currentPersonalAutomobileMode}
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

const mapStateToProps = (state: IRootState<PersonalAutomobileFormValue>) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
  formAction: state.form.poFormAction,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(NonEmployeeExpensePayment);
