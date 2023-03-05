import { Box, Container, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { LoadingCommon } from 'src/components/common';
import NoPermission from 'src/components/NoPermission';
import { useGetPODetail } from 'src/queries/PurchaseOrders/useGetPODetail';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Toastify } from 'src/services';
import {
  getUncontrolledCurrencyInputFieldProps,
  getUncontrolledInputFieldProps,
  handleScrollToTopError,
} from 'src/utils';
import Layout from '../CRUUSerContainer/layout';
import AdditionalForms from './AdditionalForms';
import BreadcrumbsPODetail from './breadcrumbs';
import { initialUpsertPOFormValue } from './constants';
import GeneralInfo from './GeneralInfo';
import { getAdditionalPOFormValue } from './helpers';
import TableLineItems from './TableLineItems';
import { UpsertPOFormikProps, UpsertPOFormValue } from './types';

const PurchaseOrderContainer: React.FC<Props> = ({ formData, onSetFormData }) => {
  const formRef = React.useRef<FormikProps<UpsertPOFormValue>>(null);
  const isEditPOMode = false;
  const hasPermission = true;

  const { onGetPOById } = useGetPODetail({
    id: '839b57dc-176b-4492-94a7-83f01efb8455', //handle when edit po ready
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

  React.useLayoutEffect(() => {
    // get initial data when first time mounted
    if (!formData) {
      // create mode
      if (!isEditPOMode) {
        onSetFormData<UpsertPOFormValue>(initialUpsertPOFormValue);
        return;
      }

      // edit mode
      onGetPOById();
      return;
    }

    // just back from additional forms mode => not fetching anything
  }, [formData, isEditPOMode, onGetPOById, onSetFormData]);

  const handleFormSubmit = (values: UpsertPOFormValue) => {
    console.log('values: ', values);
  };

  const initialFormValue = React.useMemo(() => {
    return formData || initialUpsertPOFormValue;
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
                <GeneralInfo formikProps={formikProps} disabled={false} />
              </Layout>
              <Layout>
                <TableLineItems formikProps={formikProps} disabled={false} />
              </Layout>
              <Layout>
                <AdditionalForms formikProps={formikProps} disabled={false} />
              </Layout>
            </>
          )}
        </Suspense>
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
