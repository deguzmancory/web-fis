import { Box, Container, Divider, Grid, Stack, Typography } from '@mui/material';
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
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { FED_ATTACHMENT_VALUE } from '../PurchaseInfo/helpers';
import TableLineItem from './Table/tableLineItem';
import TableMiddle from './Table/tableMiddle';
import TableTop from './Table/tableTop';
import Attachment31 from './fileAttachment/attachment31';
import Attachment32a from './fileAttachment/attachment32a';
import Title from './title';
import Attachment32bTod from './fileAttachment/attachment32bTod';

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

  const haveAttachmentFile32 = React.useMemo(() => {
    switch (formData?.fedAttachment) {
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32A:
        return <Attachment32a />;
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32B:
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32C:
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32D:
        return <Attachment32bTod formData={formData} />;
      case FED_ATTACHMENT_VALUE.NON_FEDERAL:
      case FED_ATTACHMENT_VALUE.UH_SUBAWARD:
        return null;
      default:
        return null;
    }
  }, [formData]);

  return (
    <Box mb={4} mt={4}>
      <Container maxWidth="lg">
        <Title />

        <>
          <TableTop />
          <TableMiddle />
          <TableLineItem />

          <Stack>
            <Typography variant="body2" style={{ display: 'contents' }} fontWeight="bold">
              SPECIAL INSTRUCTIONS:{' '}
              <Typography variant="body2" style={{ display: 'contents' }}>
                Refunds payable to RCUH and not traveler on any unused tickets
              </Typography>
            </Typography>

            <Typography variant="body2" fontWeight="bold" mt={3}>
              {' '}
              SEND INVOICE DUPLICATE TO
            </Typography>

            <Stack alignItems="flex-end" mt={9}>
              <Grid item xs={7}>
                <Divider />
                <Typography variant="body2" fontWeight="bold">
                  FISCAL AUTHORIZED SIGNATURE
                </Typography>
              </Grid>
            </Stack>

            <Box>
              <Typography variant="body2" fontWeight="bold">
                TO AVOID LATE PAYMENT
              </Typography>
              <Typography variant="body2">
                Indicate Purchase Order No. and your Federal TAX ID NO.
              </Typography>
              <Typography variant="body2">(SSN/EIN) on invoice.</Typography>
              <Typography variant="body2">Project No.{formData?.projectNumber}</Typography>
              <Typography variant="body2">P.O. Initiated by {formData?.loginName}</Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Stack sx={{ textAlign: 'center' }} mb={2}>
              <Typography variant="body2" fontWeight="bold">
                PURCHASE ORDER
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                DUPLICATE COPY
              </Typography>
            </Stack>

            {formData?.attachment31 && <Attachment31 />}
            {haveAttachmentFile32}
          </Box>
        </>
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
