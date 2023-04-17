import { Box, Container, Stack } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { handleNavigateBackToMainForm } from 'src/containers/AdditionalPOForms/helpers';
import {
  PO_LIST_QUERY_KEY,
  PURCHASING_LIST_WORK_FLOW_STATUS_KEY,
} from 'src/containers/POListing/enum';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import Title from './title';
import VendorPrintModePO from './PO';
import VendorPrintModePOChangeForm from './POChangeForm';

const VendorPrintMode: React.FC<Props> = ({ formData }) => {
  const { id } = useParams<{ id: string }>();

  const handleViewPOMode = () => {
    handleNavigateBackToMainForm({
      documentId: id,
      hrefNavigationForm: null,
      documentType: formData?.documentType,
    });
  };

  const handleCancelClick = () => {
    Navigator.navigate(
      `${PATHS.purchasingOrders}?${PO_LIST_QUERY_KEY.WORKFLOW_STATUS}=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.APPROVED_PO_DOCUMENTS}`
    );
  };

  const vendorPrintModeForm = React.useMemo(() => {
    switch (formData?.documentType) {
      case PO_DOCUMENT_TYPE.PURCHASE_ORDER:
        return <VendorPrintModePO />;
      case PO_DOCUMENT_TYPE.PO_CHANGE:
        return <VendorPrintModePOChangeForm />;
      default:
        return null;
    }
  }, [formData?.documentType]);

  return (
    <Box mb={4} mt={4}>
      <Container maxWidth="lg">
        <Title />

        <>{vendorPrintModeForm}</>
      </Container>

      <Stack my={4} flexDirection={'row'} justifyContent="center">
        <Button className="mr-8" onClick={handleViewPOMode}>
          Purchase Order View Mode
        </Button>
        <Button className="mr-8" onClick={handleCancelClick}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VendorPrintMode);
