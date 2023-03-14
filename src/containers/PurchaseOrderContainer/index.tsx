import { Box, Container, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button, Link, LoadingCommon } from 'src/components/common';
import NoPermission from 'src/components/NoPermission';
import { useProfile } from 'src/queries';
import { useGetPODetail } from 'src/queries/PurchaseOrders';
import { useCreatePO } from 'src/queries/PurchaseOrders/useCreatePO';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, Toastify } from 'src/services';
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
import { emptyUpsertPOFormValue } from './constants';
import { PO_ACTION, PO_FORM_KEY } from './enums';
import ExternalSpecialInstructions from './ExternalSpecialInstructions';
import GeneralInfo from './GeneralInfo';
import {
  getAdditionalPOFormValue,
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

const PurchaseOrderContainer: React.FC<Props> = ({ formData, onSetFormData }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const scrollToParam = query.get(PO_ADDITIONAL_FORM_PARAMS.SCROLL_TO) || null;

  const formRef = React.useRef<FormikProps<UpsertPOFormValue>>(null);
  const isEditPOMode = !!id;
  const hasPermission = true; //TODO: huy_dang check logic

  const { onGetPOById } = useGetPODetail({
    id: id,
    onSuccess: (data) => {
      const formValue: UpsertPOFormValue = {
        ...data,
        availableForms: getAdditionalPOFormValue(data.availableForms),
        formAttachments: getAdditionalPOFormValue(data.formAttachments),
        action: null,
      };

      onSetFormData<UpsertPOFormValue>(formValue);
    },
    onError: (error) => {
      Toastify.error(error.message);
    },
  });

  const { profile } = useProfile();

  const { createPO, isLoading } = useCreatePO({
    onSuccess: ({ data }) => {
      onSetFormData(null);
      Navigator.navigate(`${PATHS.purchaseOrderDetail}/${data.id}`);
    },
  });

  React.useLayoutEffect(() => {
    // get initial data when first time mounted
    if (!formData && !isEditPOMode) {
      // create mode
      const initialPOFormValue = getInitialPOFormValue({ profile });
      onSetFormData<UpsertPOFormValue>(initialPOFormValue);
      return;
    }

    // just back from additional forms mode => not fetching anything
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditPOMode, profile, onGetPOById, onSetFormData]);

  React.useEffect(() => {
    // get initial data when first time mounted
    if (!formData && isEditPOMode) {
      // edit mode
      onGetPOById();
      return;
    }

    // just back from additional forms mode => not fetching anything
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditPOMode, profile, onGetPOById, onSetFormData]);

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

  const { values, errors, touched, setFieldValue, getFieldProps, setFieldTouched, handleSubmit } =
    useFormik<UpsertPOFormValue>({
      initialValues: initialFormValue,
      validationSchema: getPOFormValidationSchema({ action: PO_ACTION.SAVE }),
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

  const handleCancelClick = () => {};

  return (
    <Box py={4}>
      <Container maxWidth="lg">
        <BreadcrumbsPODetail isViewMode={false} />
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
                    {/* TODO: huy_dang add link */}
                    <Link>Policy 2.201</Link>
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
          <Button
            onClick={() => {
              _handleScrollToTopError();
              setFieldValue(PO_FORM_KEY.ACTION, PO_ACTION.SAVE);
              handleSubmit();
            }}
            isLoading={isLoading}
            disabled={isLoading}
            className="mr-8"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              _handleScrollToTopError();
              setFieldValue(PO_FORM_KEY.ACTION, PO_ACTION.SUBMIT);
              handleSubmit();
            }}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Submit to FA
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState<UpsertPOFormValue>) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderContainer);
