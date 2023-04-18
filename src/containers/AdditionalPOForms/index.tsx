import { Box, Container, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FormikProps } from 'formik';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import NoPermission from 'src/components/NoPermission';
import { Button, LoadingCommon } from 'src/components/common';
import { PO_ADDITIONAL_FORM_CODE } from 'src/containers/PurchaseOrderContainer/PO/enums';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/PO/types';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { hideAllDialog, hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import {
  setFormData,
  setHrefNavigateAdditionalForm,
  setIsImmutableFormData,
} from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import urljoin from 'url-join';
import BreadcrumbsAdditionalPOForms from './breadcrumbs';
import { PO_ADDITIONAL_FORM_PARAMS } from './enum';
import FooterSection from './footerSection';
import { handleNavigateBackToMainForm } from './helpers';

const SoleSource = React.lazy(() => import('./SoleSource'));
const AuthToPurchase = React.lazy(() => import('./AuthToPurchase'));
const Determination = React.lazy(() => import('./Determination'));
const SubcontractAgreement = React.lazy(() => import('./SubcontractAgreement'));
const EquipmentInventory = React.lazy(() => import('./EquipmentInventory'));
const FfataDataCollection = React.lazy(() => import('./FfataDataCollection'));

const PurchaseOrderContainer: React.FC<Props> = ({
  formData,
  onSetFormData,
  onShowDialog,
  onHideDialog,
  onHideAllDialog,
  onSetIsImmutableFormData,
  onSetHrefNavigationForm,
}) => {
  const { formCode } = useParams<{ formCode: string }>();
  const formRef = React.useRef<FormikProps<any>>(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const documentId = query.get(PO_ADDITIONAL_FORM_PARAMS.DOCUMENT_ID) || null;
  const isViewOnly = !!query.get(PO_ADDITIONAL_FORM_PARAMS.VIEW_ONLY);

  const hasPermission = true; //TODO: update when enhancement needed

  React.useLayoutEffect(() => {
    if (!formData) {
      if (documentId) {
        Navigator.navigate(urljoin(PATHS.purchaseOrderDetail, documentId));
      } else {
        Navigator.navigate(PATHS.createPurchaseOrders);
      }
    }
  }, [formData, documentId]);

  const renderForm = React.useCallback((code: PO_ADDITIONAL_FORM_CODE) => {
    if (!formData) return null;

    switch (code) {
      case PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE:
        return <SoleSource disabled={isViewOnly} formRef={formRef} documentId={documentId} />;
      case PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY:
        return (
          <EquipmentInventory disabled={isViewOnly} formRef={formRef} documentId={documentId} />
        );
      case PO_ADDITIONAL_FORM_CODE.FFATA:
        return (
          <FfataDataCollection disabled={isViewOnly} formRef={formRef} documentId={documentId} />
        );
      case PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE:
        return <AuthToPurchase disabled={isViewOnly} formRef={formRef} documentId={documentId} />;
      case PO_ADDITIONAL_FORM_CODE.DETERMINATION:
        return <Determination disabled={isViewOnly} formRef={formRef} documentId={documentId} />;
      case PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR:
        return (
          <SubcontractAgreement disabled={isViewOnly} formRef={formRef} documentId={documentId} />
        );

      //return anther additional forms here
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFormTitle = React.useCallback((code: PO_ADDITIONAL_FORM_CODE) => {
    switch (code) {
      case PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE:
        return 'SOLE SOURCE JUSTIFICATION';
      case PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY:
        return 'EQUIPMENT INVENTORY FORM';
      case PO_ADDITIONAL_FORM_CODE.FFATA:
        return 'FFATA DATA COLLECTION FOR SUBCONTRACTOR/VENDOR';
      case PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE:
        return 'AUTHORIZATION TO PURCHASE EQUIPMENT WITH FEDERAL CONTRACT OR GRANT FUNDS';
      case PO_ADDITIONAL_FORM_CODE.DETERMINATION:
        return 'DETERMINATION OF COST OR PRICE REASONABLENESS';
      case PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR:
        return 'AGREEMENT BETWEEN THE RESEARCH CORPORATION OF THE UNIVERSITY OF HAWAII';

      //return anther additional forms here
      default:
        return 'UNKNOWN FORM';
    }
  }, []);

  const handleCancelButton = React.useCallback(() => {
    if (formRef.current.dirty) {
      onShowDialog({
        type: DIALOG_TYPES.YESNO_DIALOG,
        data: {
          title: `Cancel`,
          content: `There are unsaved changes on the Form. Are you sure you want to leave this page?`,
          okText: 'Ok',
          cancelText: 'Cancel',
          onOk: () => {
            onHideDialog();
            setTimeout(() => {
              formRef.current.handleReset();
              onSetIsImmutableFormData(true);
              handleNavigateBackToMainForm({
                documentId,
                hrefNavigationForm: null,
                documentType: formData?.documentType,
              });
            }, 50);
          },
          onCancel: () => {
            onHideAllDialog();
          },
        },
      });
    } else {
      onSetIsImmutableFormData(true);
      handleNavigateBackToMainForm({
        documentId,
        hrefNavigationForm: null,
        documentType: formData?.documentType,
      });
    }
  }, [
    documentId,
    onShowDialog,
    onHideDialog,
    onSetIsImmutableFormData,
    formData?.documentType,
    onHideAllDialog,
  ]);

  const handleSubmitForm = () => {
    formRef.current.handleSubmit();
    onSetHrefNavigationForm(null);
    setIsImmutableFormData(true);
  };

  return (
    <Box py={4}>
      <Container maxWidth="lg">
        <BreadcrumbsAdditionalPOForms
          documentId={documentId}
          documentType={formData?.documentType}
        />
        <Typography mt={2} variant="body2" textAlign={'center'}>
          Research Corporation of the University of Hawaii
        </Typography>
        <Typography mt={1} variant="h3" textAlign={'center'}>
          {getFormTitle(formCode as PO_ADDITIONAL_FORM_CODE)}
        </Typography>
        <Suspense fallback={<LoadingCommon />}>
          {!hasPermission ? (
            <SectionLayout>
              <NoPermission />
            </SectionLayout>
          ) : (
            <>{renderForm(formCode as PO_ADDITIONAL_FORM_CODE)}</>
          )}
        </Suspense>
        <FooterSection
          formCode={formCode as PO_ADDITIONAL_FORM_CODE}
          formAttachments={formData?.formAttachments}
          documentId={documentId}
          documentType={formData?.documentType}
          formRef={formRef}
        />
        <Stack my={4} flexDirection={'row'} justifyContent="center">
          <Button variant="outline" className="mr-8" onClick={() => handleCancelButton()}>
            {isViewOnly ? 'Back' : 'Cancel'}
          </Button>
          {!isViewOnly && <Button onClick={() => handleSubmitForm()}>Save</Button>}
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
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
  onHideAllDialog: hideAllDialog,
  onSetIsImmutableFormData: setIsImmutableFormData,
  onSetHrefNavigationForm: setHrefNavigateAdditionalForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderContainer);
