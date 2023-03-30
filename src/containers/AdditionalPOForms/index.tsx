import { Box, Container, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FormikProps } from 'formik';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button, LoadingCommon } from 'src/components/common';
import NoPermission from 'src/components/NoPermission';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { PO_ADDITIONAL_FORM_CODE } from 'src/containers/PurchaseOrderContainer/enums';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { hideAllDialog, hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import BreadcrumbsAdditionalPOForms from './breadcrumbs';
import EquipmentInventory from './EquipmentInventory';
import FfataDataCollectionForm from './FfataDataCollection';
import SoleSource from './SoleSource';
import AuthToPurchaseForm from './AuthToPurchase';
import DeterminationForm from './Determination';
import SubcontractAgreementForm from './SubcontractAgreement';
import { PO_ADDITIONAL_FORM_PARAMS } from './enum';
import urljoin from 'url-join';

const PurchaseOrderContainer: React.FC<Props> = ({
  formData,
  onSetFormData,
  onShowDialog,
  onHideDialog,
  onHideAllDialog,
}) => {
  const { formCode } = useParams<{ formCode: string }>();
  const formRef = React.useRef<FormikProps<any>>(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const documentId = query.get(PO_ADDITIONAL_FORM_PARAMS.DOCUMENT_ID) || null;

  // const isEditPOMode = true;
  const hasPermission = true;

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
        return <SoleSource disabled={false} formRef={formRef} documentId={documentId} />;
      case PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY:
        return <EquipmentInventory disabled={false} formRef={formRef} documentId={documentId} />;
      case PO_ADDITIONAL_FORM_CODE.FFATA:
        return (
          <FfataDataCollectionForm disabled={false} formRef={formRef} documentId={documentId} />
        );
      case PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE:
        return <AuthToPurchaseForm disabled={false} formRef={formRef} documentId={documentId} />;
      case PO_ADDITIONAL_FORM_CODE.DETERMINATION:
        return <DeterminationForm disabled={false} formRef={formRef} documentId={documentId} />;
      case PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR:
        return (
          <SubcontractAgreementForm disabled={false} formRef={formRef} documentId={documentId} />
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
        return 'SOLE SOURCE JUSTIFICATION *';
      case PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY:
        return 'EQUIPMENT INVENTORY FORM *';
      case PO_ADDITIONAL_FORM_CODE.FFATA:
        return 'FFATA DATA COLLECTION FOR SUBCONTRACTOR/VENDOR *';
      case PO_ADDITIONAL_FORM_CODE.AUTH_TO_PURCHASE:
        return 'AUTHORIZATION TO PURCHASE EQUIPMENT WITH FEDERAL CONTRACT OR GRANT FUNDS *';
      case PO_ADDITIONAL_FORM_CODE.DETERMINATION:
        return 'DETERMINATION OF COST OR PRICE REASONABLENESS *';
      case PO_ADDITIONAL_FORM_CODE.SUBCONTRACTOR:
        return 'AGREEMENT BETWEEN THE RESEARCH CORPORATION OF THE UNIVERSITY OF HAWAII';

      //return anther additional forms here
      default:
        return 'UNKNOWN FORM';
    }
  }, []);

  const handleCancelButton = React.useCallback(() => {
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
            Navigator.navigate(PATHS.createPurchaseOrders);
          }, 50);
        },
        onCancel: () => {
          onHideAllDialog();
        },
      },
    });
  }, [onHideAllDialog, onHideDialog, onShowDialog]);

  const handleSubmitForm = () => {
    formRef.current.handleSubmit();
  };

  return (
    <Box py={4}>
      <Container maxWidth="lg">
        <BreadcrumbsAdditionalPOForms isViewMode={false} />
        <Typography mt={2} variant="body2" textAlign={'center'}>
          The Research Corporation of the University of Hawaii
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
        <Stack my={4} flexDirection={'row'} justifyContent="center">
          <Button variant="outline" className="mr-8" onClick={() => handleCancelButton()}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmitForm()}>Save</Button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderContainer);
