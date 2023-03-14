import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { Checkbox, Input, TextareaAutosize } from 'src/components/common';
import { POAuthToPurchasePayload } from 'src/queries/PurchaseOrders';
import { getErrorMessage } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_AUTH_TO_PURCHASE_KEY } from '../enum';

const CheckAndFill: React.FC<Props> = ({ formikProps }) => {
  const { errors, touched, getUncontrolledFieldProps, getFieldProps } = formikProps;
  const _getErrorMessage = (fieldName: PO_AUTH_TO_PURCHASE_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Check and Fill in the Appropriate Block or Blocks.
      </Typography>
      <Box mb={2}>
        <Checkbox.Item
          label="Purchase requires prior written approval from the sponsoring agency (Administrative Contracting Officer or other official specified in the contract/grant document). This approval is attached."
          {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.REQUIRES_PRIOR_APPROVAL)}
          errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.REQUIRES_PRIOR_APPROVAL)}
        />
      </Box>
      <Box mb={2}>
        <Checkbox.Item
          label="Purchase does not require prior written approval of the sponsoring agency for the following reason(s):"
          {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL)}
          errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL)}
        />
        <TextareaAutosize
          errorMessage={_getErrorMessage(
            PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL_REASON
          )}
          {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL_REASON)}
        />
      </Box>
      <Grid item container>
        <Grid item>
          <Box mb={2}>
            <Checkbox.Item
              label="Equipment title to be vested"
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.EQUIPMENT_TITLE_VESTED)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.EQUIPMENT_TITLE_VESTED)}
            />
          </Box>
        </Grid>
        <Grid item container sx={{ px: 2, mb: 1 }} style={{ flexDirection: 'column' }}>
          <Box mb={2}>
            <Checkbox.Item
              label="Federal Government"
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.FED)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.FED)}
            />
          </Box>
          <Box mb={2}>
            <Checkbox.Item
              label="University"
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.UNI)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.UNI)}
            />
          </Box>
          <Box mb={2}>
            <Checkbox.Item
              label="Multiple Federal Sponsors: If so, indicate cost allocation plan to accounts with approvals cited in blocks 1 or 2. This plan is attached."
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.MULTIPLE_FEDERAL_SPONSORS)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.MULTIPLE_FEDERAL_SPONSORS)}
            />
          </Box>
          <Grid item container>
            <Grid item xs={7}>
              <Box mb={2}>
                <Checkbox.Item
                  label="Cost Sharing. If so indicate percentage of Federal and University participation. 
                             (Example: 60/40 50/50 70/30 etc. with Federal or State funds.)"
                  {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.COST_SHARING)}
                  errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.COST_SHARING)}
                />
              </Box>
            </Grid>
            <Grid item container xs={5} alignItems="center">
              <Typography variant="body2">Federal / State</Typography>
              <Grid item container>
                <Grid item xs={1.5}>
                  <Input
                    maxLength={2}
                    errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.FEDERAL_PERCENTAGE)}
                    {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.FEDERAL_PERCENTAGE)}
                  />
                </Grid>
                <span> {' / '} </span>
                <Grid item xs={1.5}>
                  <Input
                    maxLength={2}
                    errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.STATE_PERCENTAGE)}
                    {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.STATE_PERCENTAGE)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mb={2}>
            <Checkbox.Item
              label="Item is classified as Industrial Plant Equipment (IPE). Unit cost exceeds $10000 (applies to DOD contracts and grants and NASA contracts)."
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.IPE)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.IPE)}
            />
          </Box>
          <Box mb={2}>
            <Checkbox.Item
              label="DD Form 1419 is attached showing approval and certifying nonavailability."
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.DD)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.DD)}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Remarks</Typography>
          <TextareaAutosize
            maxLength={5000}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.REMARKS)}
            {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.REMARKS)}
          />
        </Grid>
      </Grid>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<POAuthToPurchasePayload>;
};

export default CheckAndFill;
