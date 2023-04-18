import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';

const SpecialInstructions: React.FC<Props> = ({ formData }) => {
  const isPOChangeForm = React.useMemo(() => {
    return formData?.documentType === PO_DOCUMENT_TYPE.PO_CHANGE;
  }, [formData?.documentType]);

  return (
    <Stack>
      <Typography variant="body2" style={{ display: 'contents' }} fontWeight="bold">
        SPECIAL INSTRUCTIONS:{' '}
        <Typography variant="body2" style={{ display: 'contents' }}>
          Refunds payable to RCUH and not traveler on any unused tickets
        </Typography>
      </Typography>

      <Grid container mt={2}>
        <Grid item xs={9}>
          <Typography variant="body2" fontWeight="bold">
            {' '}
            SEND INVOICE DUPLICATE TO
          </Typography>

          <Stack flexDirection="column">
            <Typography variant="body2">{formData?.sendInvoiceTo}</Typography>
            <Typography variant="body2">{formData?.invoiceDept}</Typography>
            <Typography variant="body2">{formData?.sendInvoiceToFaEmail}</Typography>
            <Typography variant="body2">{formData?.invoiceStreetAddress}</Typography>
            <Typography variant="body2">
              {formData?.invoiceCity} {formData?.invoiceState} {formData?.invoiceZip}{' '}
              {formData?.invoiceZip4 ? '-' : ''} {formData?.invoiceZip4}
            </Typography>
            <Typography variant="body2">{formData?.invoiceCountry}</Typography>
          </Stack>
        </Grid>

        {!isPOChangeForm ? (
          <Grid item xs={3} mt={14} textAlign="center">
            <Typography variant="body2" fontWeight="bold" borderTop={1}>
              FISCAL AUTHORIZED SIGNATURE
            </Typography>
          </Grid>
        ) : (
          <Grid item xs={3} mt={14}>
            {}
          </Grid>
        )}
      </Grid>

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
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialInstructions);
