import { Box, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { getVendorAddress } from 'src/containers/PurchaseOrderContainer/GeneralInfo/helpers';
import { getPOFormValueFromResponse } from 'src/containers/PurchaseOrderContainer/helpers';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import {
  useGetPODetail,
  useGetPOPaymentDetail,
  useProfile,
  useUpdateVendorRegistration,
} from 'src/queries';
import { setFormData, setIsImmutableFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/store';
import { Navigator, Toastify } from 'src/services';
import Prompt from 'src/services/Prompt';
import {
  getUncontrolledInputFieldProps,
  handleScrollToTopError,
  handleShowErrorMsg,
} from 'src/utils';
import urljoin from 'url-join';
import { VENDOR_REGISTRATION_NAVIGATE_FROM, VENDOR_REGISTRATION_PARAMS } from '../enums';
import AssigneeInfo from './AssigneeInfo';
import FileAttachments from './FileAttachments';
import SelectVendor from './SelectVendor';
import VendorInfo from './VendorInfo';
import { initialVendorRegistrationFromData, vendorRegistrationValidationSchema } from './constants';
import { getVendorRegistrationPayload } from './helpers';
import CreateVendorRegistrationTitle from './titleHeader';
import { VendorRegistrationFormValue, VendorRegistrationFormikProps } from './types';

const CreateVendorRegistration: React.FC<Props> = ({
  formData,
  isViewOnly = false,
  onSetFormData,
  onSetIsImmutableFormData,
}) => {
  const formRef = React.useRef<FormikProps<VendorRegistrationFormValue>>(null);

  // using params here to redirect to previous section instead of using state of location
  // => increase more certain redirect
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  const redirectSection = query.get(
    VENDOR_REGISTRATION_PARAMS.CALLING_FROM
  ) as VENDOR_REGISTRATION_NAVIGATE_FROM;
  const documentId = query.get(VENDOR_REGISTRATION_PARAMS.DOCUMENT_ID) || null;
  const vendorRegistrationId = query.get(VENDOR_REGISTRATION_PARAMS.VENDOR_REGISTRATION_ID) || null;

  //TODO: huy_dang get vendor registration by Id when reload
  const {
    updateVendorRegistration,
    isLoading: isVendorRegistrationLoading,
    isSuccess: isUPdateVendorRegistrationSuccess,
  } = useUpdateVendorRegistration();
  const { profile } = useProfile();
  const { onGetPOById } = useGetPODetail({
    id: documentId,
    onError: (error) => {
      Toastify.error(error.message);
    },
  });

  const handleFormSubmit = (values) => {
    const payload = getVendorRegistrationPayload({ values, vendorRegistrationId });

    updateVendorRegistration(payload, {
      onSuccess: async ({ data }) => {
        if (redirectSection === VENDOR_REGISTRATION_NAVIGATE_FROM.PO) {
          const vendorResponse = {
            name: data.line1,
            name2: data.line2,
            code: data.code,
            w9: data.w9,
            address1: data.line3,
            address2: data.line4,
            address3: data.line5,
          };

          const newVendorData = {
            vendorName: vendorResponse,
            vendorCode: vendorResponse,
            vendorAddress: getVendorAddress(vendorResponse),
            address1: vendorResponse.address1,
            address2: vendorResponse.address2,
            address3: vendorResponse.address3,
          };

          //if there's no formData => redirect page have no data => fetch data to prepari
          if (!formData) {
            const { data: poDataResponse } = await onGetPOById();

            const formValue: UpsertPOFormValue = getPOFormValueFromResponse({
              response: poDataResponse,
              profile,
            });

            onSetFormData<UpsertPOFormValue>({ ...formValue, ...newVendorData });
          } else {
            onSetFormData<UpsertPOFormValue>({
              ...formData,
              ...newVendorData,
            });
          }

          onSetIsImmutableFormData(true);

          setTimeout(() => {
            if (documentId) {
              Navigator.navigate(urljoin(PATHS.purchaseOrderDetail, documentId));
            } else {
              Navigator.navigate(PATHS.createPurchaseOrders);
            }
          });
        }
      },
      onError: (error) => {
        handleShowErrorMsg(error);
      },
    });
  };

  const {
    values,
    errors,
    touched,
    dirty: isFormDirty,
    validateForm,
    setFieldValue,
    getFieldProps,
    setFieldTouched,
    handleSubmit,
  } = useFormik<VendorRegistrationFormValue>({
    initialValues: initialVendorRegistrationFromData,
    validationSchema: vendorRegistrationValidationSchema,
    innerRef: formRef,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
  });

  const _handleScrollToTopError = React.useCallback((errors) => {
    handleScrollToTopError(errors);
  }, []);

  const formikProps: VendorRegistrationFormikProps = {
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
  };

  const handleCancelClick = () => {
    switch (redirectSection) {
      case VENDOR_REGISTRATION_NAVIGATE_FROM.PO: {
        onSetIsImmutableFormData(true);
        if (documentId) {
          return Navigator.navigate(urljoin(PATHS.purchaseOrderDetail, documentId));
        } else {
          return Navigator.navigate(PATHS.createPurchaseOrders);
        }
      }

      default:
        Navigator.navigate(PATHS.vendors);
        return;
    }
  };

  const blockCondition = (location: Location<string>) => {
    if (isUPdateVendorRegistrationSuccess) {
      return false;
    }

    return isFormDirty;
  };

  const Header = React.useMemo(() => {
    return (
      <Stack direction={'row'} alignItems={'center'} justifyContent="end">
        <Typography>
          <span className="has-text-danger fw-bold text-is-16">*</span> = required field
        </Typography>
      </Stack>
    );
  }, []);

  return (
    <Prompt
      title={'Leave site?'}
      message={'There are unsaved changes on the Form. Are you sure you want to leave this page?'}
      cancelOkText="Yes, leave"
      cancelText="No, stay"
      condition={blockCondition}
    >
      <Box>
        <CreateVendorRegistrationTitle />

        <SectionLayout header={Header}>
          <VendorInfo formikProps={formikProps} disabled={isViewOnly} />
        </SectionLayout>
        <SectionLayout>
          <SelectVendor formikProps={formikProps} disabled={isViewOnly} />
        </SectionLayout>
        <SectionLayout>
          <FileAttachments
            formikProps={formikProps}
            vendorRegistrationId={vendorRegistrationId}
            disabled={isViewOnly}
          />
        </SectionLayout>
        <SectionLayout>
          <AssigneeInfo formikProps={formikProps} disabled={isViewOnly} />
        </SectionLayout>

        <Stack my={4} flexDirection={'row'} justifyContent="center">
          <Button
            variant="outline"
            className="mr-8"
            disabled={isVendorRegistrationLoading}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          {!isViewOnly && (
            <Button
              className="mr-8"
              onClick={async () => {
                handleSubmit();
                const errors = await validateForm();
                _handleScrollToTopError(errors);
              }}
              isLoading={isVendorRegistrationLoading}
              disabled={isVendorRegistrationLoading}
            >
              Submit
            </Button>
          )}
        </Stack>
      </Box>
    </Prompt>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    isViewOnly?: boolean;
  };

const mapStateToProps = (state: IRootState) => ({
  formData: state.form.formData,
  isImmutableFormData: state.form.isImmutableFormData,
});

const mapDispatchToProps = {
  onSetFormData: setFormData,
  onSetIsImmutableFormData: setIsImmutableFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateVendorRegistration);
