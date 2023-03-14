import { Box, Container, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FormikProps } from 'formik';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
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
import BreadcrumbsPODetail from './breadcrumbs';
import EquipmentInventory from './EquipmentInventory';
import FfataDataCollectionForm from './FfataDataCollection';
import SoleSource from './SoleSource';

const PurchaseOrderContainer: React.FC<Props> = ({
  formData,
  onSetFormData,
  onShowDialog,
  onHideDialog,
  onHideAllDialog,
}) => {
  const { formCode } = useParams<{ formCode: string }>();
  const formRef = React.useRef<FormikProps<any>>(null);

  // const isEditPOMode = true;
  const hasPermission = true;

  React.useLayoutEffect(() => {
    if (!formData) {
      Navigator.navigate(PATHS.createPurchaseOrders);
    }
  }, [formData]);

  const renderForm = React.useCallback((code: PO_ADDITIONAL_FORM_CODE) => {
    switch (code) {
      case PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE:
        return <SoleSource disabled={false} formRef={formRef} />;
      case PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY:
        return <EquipmentInventory disabled={false} formRef={formRef} />;
      case PO_ADDITIONAL_FORM_CODE.FFATA:
        return <FfataDataCollectionForm disabled={false} formRef={formRef} />;

      //return anther additional forms here
      default:
        return null;
    }
  }, []);

  const getFormTitle = React.useCallback((code: PO_ADDITIONAL_FORM_CODE) => {
    switch (code) {
      case PO_ADDITIONAL_FORM_CODE.SOLE_SOURCE:
        return 'SOLE SOURCE JUSTIFICATION *';
      case PO_ADDITIONAL_FORM_CODE.EQUIPMENT_INVENTORY:
        return 'EQUIPMENT INVENTORY FORM *';
      case PO_ADDITIONAL_FORM_CODE.FFATA:
        return 'FFATA DATA COLLECTION FOR SUBCONTRACTOR/VENDOR *';

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
        <BreadcrumbsPODetail isViewMode={false} />
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
