import { Box, Container, Typography } from '@mui/material';
import { FormikProps } from 'formik';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button, LoadingCommon } from 'src/components/common';
import NoPermission from 'src/components/NoPermission';
import Layout from 'src/containers/CRUUSerContainer/layout';
import { PO_ADDITIONAL_FORM_CODE } from 'src/containers/PurchaseOrderContainer/enums';
import { UpsertPOFormValue } from 'src/containers/PurchaseOrderContainer/types';
import { setFormData } from 'src/redux/form/formSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import BreadcrumbsPODetail from './breadcrumbs';
import EquipmentInventory from './EquipmentInventory';
import SoleSource from './SoleSource';

const PurchaseOrderContainer: React.FC<Props> = ({ formData, onSetFormData }) => {
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

      //return anther additional forms here

      default:
        return 'UNKNOWN FORM';
    }
  }, []);

  const handleBackToPOForm = () => {
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
            <Layout>
              <NoPermission />
            </Layout>
          ) : (
            <Layout>{renderForm(formCode as PO_ADDITIONAL_FORM_CODE)}</Layout>
          )}
        </Suspense>
        <Button onClick={handleBackToPOForm}>Back to PO form</Button>
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
