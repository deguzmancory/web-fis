import { Box, Container, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Location } from 'history';
import { isEqual } from 'lodash';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { NO_OPENER } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { Button, Link, LoadingCommon } from 'src/components/common';
import CustomErrorBoundary from 'src/components/ErrorBoundary/CustomErrorBoundary';
import NoPermission from 'src/components/NoPermission';
import { useProfile } from 'src/queries';
import { useGetPODetail } from 'src/queries/PurchaseOrders';
import { PO_DETAIL_STATUS } from 'src/queries/PurchaseOrders/enums';
import { useCreatePO } from 'src/queries/PurchaseOrders/useCreatePO';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import {
  getUncontrolledCurrencyInputFieldProps,
  getUncontrolledInputFieldProps,
  handleScrollToTopError,
} from 'src/utils';
import { PO_ADDITIONAL_FORM_KEY, PO_ADDITIONAL_FORM_PARAMS } from '../AdditionalPOForms/enum';
import SectionLayout from '../shared/SectionLayout';
import AdditionalForms from './AdditionalForms';
import AuthorizedBy from './AuthorizedBy';
import BreadcrumbsPODetail from './breadcrumbs';
import { emptyUpsertPOFormValue, initialLineItemValue } from './constants';
import { PO_ACTION, PO_FORM_KEY } from './enums';
import ErrorWrapperPO from './ErrorWrapper/index.';
import ExternalSpecialInstructions from './ExternalSpecialInstructions';
import GeneralInfo from './GeneralInfo';
import {
  getAvailableFormsFromResponse,
  getCreatePOPayload,
  getInitialPOFormValue,
  getPOFormValidationSchema,
} from './helpers';
import InternalComments from './InternalComments';
import InternalSpecialInstructions from './InternalSpecialInstructions';
import PurchaseInfo from './PurchaseInfo';
import SendInvoiceInfo from './SendInvoiceInfo';
import TableLineItems from './TableLineItems';
import { UpsertPOFormikProps, UpsertPOFormValue } from './types';

const PurchaseOrderContainer: React.FC<Props> = ({
  formData,
  isImmutableFormData,
  onSetFormData,
  onSetIsImmutableFormData,
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [formAction, setFormAction] = React.useState<PO_ACTION>(null);
  const [isTriedSubmit, setIsTriedSubmit] = React.useState<boolean>(false);
  const formRef = React.useRef<FormikProps<UpsertPOFormValue>>(null);
  const scrollToParam = query.get(PO_ADDITIONAL_FORM_PARAMS.SCROLL_TO) || null;
  const isEditPOMode = !!id;
  const hasPermission = true; //TODO: huy_dang check logic
  const showDeleteButton = React.useMemo(
    () => formData?.status === PO_DETAIL_STATUS.PI_PENDING_SUBMITTAL,
    [formData?.status]
  );

  const { onGetPOById } = useGetPODetail({
    id: id,
    onSuccess: (data) => {
      const formValue: UpsertPOFormValue = {
        ...data,
        availableForms: getAvailableFormsFromResponse(data.availableForms),
        formAttachments: getAvailableFormsFromResponse(data.formAttachments),
        lineItems: [...data.lineItems, initialLineItemValue],
        action: null,
      };

      onSetFormData<UpsertPOFormValue>(formValue);
    },
    onError: (error) => {
      Toastify.error(error.message);
    },
    suspense: true,
  });

  const { profile } = useProfile();

  const {
    createPO,
    data: createPOResponse,
    isLoading,
    isSuccess: isCreatePOSuccess,
  } = useCreatePO({
    onSuccess: () => {
      onSetFormData(null);

      //continue navigate to success page with use effect above => for ignore prompt check url when crate succeed purpose
    },
  });

  // Navigate to create PO success page
  React.useEffect(() => {
    if (isCreatePOSuccess) {
      Navigator.navigate(`${PATHS.purchaseOrderDetail}/${createPOResponse.data.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatePOSuccess]);

  /* INIT DATA */
  // get initial data when first time mounted

  // create mode
  // using useLayoutEffect to avoid flash at first time render
  React.useLayoutEffect(() => {
    const isInitialEmptyForm = !formData && !isEditPOMode;
    const isFormDataExistButNeedToClear = formData && !isImmutableFormData;

    if (isInitialEmptyForm || isFormDataExistButNeedToClear) {
      const initialPOFormValue = getInitialPOFormValue({ profile });
      onSetFormData<UpsertPOFormValue>(initialPOFormValue);
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditPOMode, profile, onGetPOById, onSetFormData]);

  // edit mode
  // using useEffect for fetch data from api
  React.useEffect(() => {
    if (!formData && isEditPOMode) {
      onGetPOById();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditPOMode, profile, onGetPOById, onSetFormData]);

  // else formData && isImmutableFormData
  // => just back from additional forms mode => not fetching anything
  /* END INIT DATA */

  // Auto scroll to additional form section base on scrollToParam
  React.useEffect(() => {
    if (scrollToParam && scrollToParam === PO_ADDITIONAL_FORM_KEY.ADDITIONAL_FORMS) {
      const additionalFormId = document.getElementById(PO_ADDITIONAL_FORM_KEY.ADDITIONAL_FORMS);

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
    } else {
      const createPOPayload = getCreatePOPayload({ formValues: values, action: values.action });
      createPO(createPOPayload);
    }
  };

  const initialFormValue = React.useMemo(() => {
    return formData || emptyUpsertPOFormValue;
  }, [formData]);

  const validationSchema = React.useMemo(
    () => getPOFormValidationSchema({ action: formAction }),
    [formAction]
  );

  const {
    values,
    errors,
    touched,
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
    getUncontrolledCurrencyInputFieldProps: getUncontrolledCurrencyInputFieldProps({
      values,
      setFieldTouched,
      setFieldValue,
    }),
  };

  const _handleScrollToTopError = React.useCallback(() => {
    handleScrollToTopError(errors);
  }, [errors]);

  // set form action states for updating form's validation schema purpose
  const handleSubmitButtonClick = ({ action }: { action: PO_ACTION }) => {
    setFieldValue(PO_FORM_KEY.ACTION, action);
    setFormAction(action);
    setIsTriedSubmit(true);
    validateForm();
  };

  const handleCancelClick = () => {
    Navigator.navigate(PATHS.dashboard);
  };

  const handleDeleteClick = () => {};

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
    const equalValue = isEqual(initialFormValue, values);
    let condition: boolean;

    if (location.pathname.includes(`${PATHS.poAdditionalForm}/`)) {
      condition = false;
    } else if (!isEditPOMode) {
      condition = !location.pathname.includes(`${PATHS.createPurchaseOrders}/`) && !equalValue;
    } else if (isEditPOMode) {
      if (!isCreatePOSuccess && equalValue) {
        condition = false;
      } else if (isCreatePOSuccess) {
        condition = false;
      } else {
        condition = !location.pathname.includes(`${PATHS.purchaseOrderDetail}/`) && !equalValue;
      }
    }

    return condition;
  };

  return (
    <Prompt
      title={'Leave site?'}
      message={'There are unsaved changes on the Form. Are you sure you want to leave this page?'}
      condition={blockCondition}
      cancelOkText="Yes, leave"
      cancelText="No, stay"
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
                <SectionLayout
                  header={
                    <Stack direction={'row'} alignItems={'center'} justifyContent="end">
                      <Typography>
                        <span className="has-text-danger fw-bold text-is-16">**</span> = required to
                        Save
                      </Typography>
                      <Typography mx={1}>
                        <span className="has-text-danger fw-bold text-is-16">*</span> = required to
                        Submit/Approve RCUH
                      </Typography>
                      <Link
                        href="https://www.rcuh.com/2-000/2-200/2-201/"
                        target={'_blank'}
                        rel={NO_OPENER}
                      >
                        RCUH Policy 2.201
                      </Link>
                    </Stack>
                  }
                >
                  <GeneralInfo formikProps={formikProps} />
                </SectionLayout>
                <SectionLayout>
                  <TableLineItems formikProps={formikProps} />
                </SectionLayout>
                <SectionLayout>
                  <PurchaseInfo formikProps={formikProps} />
                </SectionLayout>
                <SectionLayout>
                  <AdditionalForms formikProps={formikProps} />
                </SectionLayout>
                <SectionLayout>
                  <InternalSpecialInstructions formikProps={formikProps} />
                </SectionLayout>
                <SectionLayout>
                  <ExternalSpecialInstructions formikProps={formikProps} />
                </SectionLayout>
                <SectionLayout>
                  <SendInvoiceInfo formikProps={formikProps} />
                </SectionLayout>
                <SectionLayout>
                  <AuthorizedBy formikProps={formikProps} />
                </SectionLayout>
                <SectionLayout>
                  <InternalComments formikProps={formikProps} />
                </SectionLayout>
              </>
            )}
          </Suspense>

          <Stack my={4} flexDirection={'row'} justifyContent="center">
            <Button variant="outline" className="mr-8" onClick={handleCancelClick}>
              Cancel
            </Button>
            {showDeleteButton && (
              <Button variant="outline" className="mr-8" onClick={handleDeleteClick}>
                Delete
              </Button>
            )}
            <Button
              onClick={() => handleSubmitButtonClick({ action: PO_ACTION.SAVE })}
              isLoading={isLoading}
              disabled={isLoading}
              className="mr-8"
            >
              Save
            </Button>
            <Button
              onClick={() => handleSubmitButtonClick({ action: PO_ACTION.SUBMIT })}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Submit to FA
            </Button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderContainerWrapper);
