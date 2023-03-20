import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Input, InputPhone } from 'src/components/common';

const CreateVendorRegistration: React.FC<Props> = ({ isViewOnly = false }) => {
  return (
    <Box>
      <CreateVendorRegistrationTitle />

      <Layout>
        <Typography variant="h5" mb={2}>
          1. Enter the Name as shown on Line 1 of the vendor's W-9. For an employee vendor record,
          or an individual submitting a UH WH-1, GO TO #2.
        </Typography>

        <Input label="Taxpayer Name" />

        <Typography variant="h5" my={2}>
          2. Enter the Business Name/disregarded entity name as shown on Line 2 of the vendor's W-9.
          If Line 2 of the W-9 is blank, re-enter the Name from line 1. THE RCUH CHECK WILL BE MADE
          PAYABLE TO THE NAME BELOW. *
        </Typography>

        <Typography variant="h5" mb={2}>
          Individual
        </Typography>

        <Grid container spacing={3} mb={2}>
          <Grid item xs={4}>
            <Input label="First Name" />
          </Grid>
          <Grid item xs={4}>
            <Input label="Last Name" />
          </Grid>
          <Grid item xs={4} container spacing={3}>
            <Grid item xs={5}>
              <Input
                label="MI"
                maxLength={5}
                infoToolTipWithArrow
                infoTooltipMessage="Middle Initial"
                infoTooltipPlacement="right-end"
              />
            </Grid>
            <Grid item xs={7}>
              <Input label="Suffix (e.g., Jr, Sr, II, etc.)" />
            </Grid>
          </Grid>
        </Grid>

        <Input
          label={
            <>
              Or <b>Business/Trade name</b>
            </>
          }
        />

        <Typography variant="h5" my={2}>
          3. Enter the vendor’s address (only a U.S. address is allowed).
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Input label={'Department/Office'} />
          </Grid>
          <Grid item xs={8}>
            <Input label={'Address (Number, Street, and Apt/Suite/Room No.)'} required />
          </Grid>
          <Grid item xs={4}>
            <Input label={'City'} required />
          </Grid>
          <Grid item xs={4}>
            <Input label={'State'} required />
          </Grid>
          <Grid item xs={3}>
            <Input label={'Zipcode'} required />
          </Grid>
          <Grid item xs={1}>
            <Input label={<>&nbsp;</>} />
          </Grid>
          <Grid item xs={4}>
            <InputPhone label={'Phone Number'} name="asdasdasd" />
          </Grid>
          <Grid item xs={4}>
            <Input label={'Email Address'} />
          </Grid>
        </Grid>
      </Layout>
    </Box>
  );
};

const CreateVendorRegistrationTitle = () => {
  return (
    <Box>
      <Typography variant="h2" mt={2} mb={1}>
        Vendor Registration
      </Typography>
      <Typography variant="body2">
        For U.S. Citizens & U.S. Entities only. Do not use this form for Non-U.S. Vendor.
      </Typography>
    </Box>
  );
};

const Layout = ({ children }) => {
  return (
    <Box p={4} mt={2} bgcolor={'white'} border={COLOR_CODE.DEFAULT_BORDER}>
      {children}
    </Box>
  );
};

type Props = {
  isViewOnly?: boolean;
};

export default CreateVendorRegistration;
