import { Box, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/redux/rootReducer';
import TableLineItem from './Table/tableLineItem';
import TableMiddle from './Table/tableMiddle';
import TableTop from './Table/tableTop';
import Title from './title';

const VendorPrintMode: React.FC<Props> = ({ formData }) => {
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

          {/* TODO: Tuyen Tran add text content */}
          <Box sx={{ mt: 2 }}>
            <Stack sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight="bold">
                PURCHASE ORDER
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                DUPLICATE COPY
              </Typography>
            </Stack>
          </Box>
        </>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VendorPrintMode);
