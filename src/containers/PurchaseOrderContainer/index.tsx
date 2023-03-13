import { Box, Container, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, LoadingCommon } from 'src/components/common';
import NoPermission from 'src/components/NoPermission';
import { useProfile } from 'src/queries';
import { useGetPODetail } from 'src/queries/PurchaseOrders';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Toastify } from 'src/services';
import {
  getUncontrolledCurrencyInputFieldProps,
  getUncontrolledInputFieldProps,
  handleScrollToTopError,
} from 'src/utils';
import { PO_ADDITIONAL_FORM_KEY, PO_ADDITIONAL_FORM_PARAMS } from '../AdditionalPOForms/enum';
import Layout from '../CRUUSerContainer/layout';
import AdditionalForms from './AdditionalForms';
import AuthorizedBy from './AuthorizedBy';
import BreadcrumbsPODetail from './breadcrumbs';
import { emptyUpsertPOFormValue } from './constants';
import ExternalSpecialInstructions from './ExternalSpecialInstructions';
import GeneralInfo from './GeneralInfo';
import { getAdditionalPOFormValue, getInitialPOFormValue } from './helpers';
import InternalComments from './InternalComments';
import InternalSpecialInstructions from './InternalSpecialInstructions';
import PurchaseInfo from './PurchaseInfo';
import SendInvoiceInfo from './SendInvoiceInfo';
import TableLineItems from './TableLineItems';
import { UpsertPOFormikProps, UpsertPOFormValue } from './types';

const PurchaseOrderContainer: React.FC<Props> = ({ formData, onSetFormData }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const scrollToParam = query.get(PO_ADDITIONAL_FORM_PARAMS.SCROLL_TO) || null;

  const formRef = React.useRef<FormikProps<UpsertPOFormValue>>(null);
  const isEditPOMode = false;
  const hasPermission = true;
  const loading = false;

  const { onGetPOById } = useGetPODetail({
    id: '839b57dc-176b-4492-94a7-83f01efb8455', //TODO: handle when edit po ready
    onSuccess: (data) => {
      const formValue: UpsertPOFormValue = {
        ...data,
        availableForms: getAdditionalPOFormValue(data.availableForms),
        formAttachments: getAdditionalPOFormValue(data.formAttachments),
      };

      onSetFormData<UpsertPOFormValue>(formValue);
    },
    onError: (error) => {
      Toastify.error(error.message);
    },
  });

  const { profile } = useProfile();

  React.useLayoutEffect(() => {
    // get initial data when first time mounted
    if (!formData) {
      // create mode
      if (!isEditPOMode) {
        const initialPOFormValue = getInitialPOFormValue({ profile });
        onSetFormData<UpsertPOFormValue>(initialPOFormValue);
        return;
      }

      // edit mode
      onGetPOById();
      return;
    }

    // just back from additional forms mode => not fetching anything
  }, [formData, onSetFormData, isEditPOMode, profile, onGetPOById]);

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
    console.log('values: ', values);
  };

  const initialFormValue = React.useMemo(() => {
    return formData || emptyUpsertPOFormValue;
  }, [formData]);

  const { values, errors, touched, setFieldValue, getFieldProps, setFieldTouched, handleSubmit } =
    useFormik<UpsertPOFormValue>({
      initialValues: initialFormValue,
      validationSchema: null,
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
            <Layout>
              <NoPermission />
            </Layout>
          ) : (
            <>
              <Layout>
                <GeneralInfo formikProps={formikProps} />
              </Layout>
              <Layout>
                <TableLineItems formikProps={formikProps} />
              </Layout>
              <Layout>
                <PurchaseInfo formikProps={formikProps} />
              </Layout>
              <Layout>
                <AdditionalForms formikProps={formikProps} />
              </Layout>
              <Layout>
                <InternalSpecialInstructions formikProps={formikProps} />
              </Layout>
              <Layout>
                <ExternalSpecialInstructions formikProps={formikProps} />
              </Layout>
              <Layout>
                <SendInvoiceInfo formikProps={formikProps} />
              </Layout>
              <Layout>
                <AuthorizedBy formikProps={formikProps} />
              </Layout>
              <Layout>
                <InternalComments formikProps={formikProps} />
              </Layout>
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
              handleSubmit();
            }}
            isLoading={loading}
            disabled={loading}
            className="mr-8"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              _handleScrollToTopError();
              handleSubmit();
            }}
            isLoading={loading}
            disabled={loading}
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
