import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { Checkbox, RadioButton } from 'src/components/common';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';

const CUDetails: React.FC<Props> = ({ formikProps }) => {
  // const {} = formikProps;
  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Access Roles Granted
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Checkbox.Item
            label="Approval of POs and Payments over $24,999"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Box mb={2} />
          <Checkbox.Item
            label="Print Checks"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Checkbox.Item
            label="View Check Registers"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Box mb={2} />
          <RadioButton
            label="User Management"
            columns={1}
            options={[
              { label: 'All', value: 'ALL' },
              { label: 'Non Central Users', value: 'NON_CENTRAL_USERS' },
              { label: 'View Only', value: 'VIEW_ONLY' },
            ]}
            containerClassName="element-title-bold"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Checkbox.Item
            label="Edit Staff Listing"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
        </Grid>
        <Grid item xs={4}>
          <Checkbox.Item
            label="RCUH Payroll Report"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Checkbox.Item
            label="Financial Forecast Payroll Report"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Checkbox.Item
            label="Vacation and Sick Leave Audit Page"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Box mb={2} />
          <Checkbox.Item
            label="View Vendor List"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Checkbox.Item
            label="View Vendor Master Records"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
          <Checkbox.Item
            label="Edit Vendor Master Records"
            // {...getFieldProps(CRUUSER_KEY.STATUS)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
type Props = {
  formikProps: CRUUserFormikProps;
};
export default CUDetails;
