import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { Checkbox, Input, TextareaAutosize } from 'src/components/common';
import { POAuthToPurchasePayload } from 'src/queries/PurchaseOrders';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_AUTH_TO_PURCHASE_KEY } from '../enum';
import { PO_AUTH_TO_PURCHASE_LABEL } from './enum';

const CheckAndFill: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { values, errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } =
    formikProps;
  const _getErrorMessage = (fieldName: PO_AUTH_TO_PURCHASE_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target?.checked;
    const nameFieldValue = event.target.name;

    // eslint-disable-next-line security/detect-object-injection
    if (checked && !values[nameFieldValue]) {
      setFieldValue(
        nameFieldValue,
        // eslint-disable-next-line security/detect-object-injection
        PO_AUTH_TO_PURCHASE_LABEL[nameFieldValue]
      );
    } else setFieldValue(nameFieldValue, '');
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Check and Fill in the Appropriate Block or Blocks.
      </Typography>
      <Box mb={2}>
        <Checkbox.Item
          label={PO_AUTH_TO_PURCHASE_LABEL.requiresPriorApproval}
          {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.REQUIRES_PRIOR_APPROVAL)}
          errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.REQUIRES_PRIOR_APPROVAL)}
          onChange={handleChangeValue}
          disabled={disabled}
        />
      </Box>
      <Box mb={2}>
        <Checkbox.Item
          label={PO_AUTH_TO_PURCHASE_LABEL.notRequirePriorApproval}
          {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL)}
          errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL)}
          onChange={handleChangeValue}
          disabled={disabled}
        />
        <TextareaAutosize
          errorMessage={_getErrorMessage(
            PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL_REASON
          )}
          {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL_REASON)}
          disabled={disabled}
        />
      </Box>
      <Grid item container>
        <Grid item>
          <Box mb={2}>
            <Checkbox.Item
              label={PO_AUTH_TO_PURCHASE_LABEL.equipmentTitleVested}
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.EQUIPMENT_TITLE_VESTED)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.EQUIPMENT_TITLE_VESTED)}
              onChange={handleChangeValue}
              disabled={disabled}
            />
          </Box>
        </Grid>
        <Grid item container sx={{ px: 2, mb: 1 }} style={{ flexDirection: 'column' }}>
          <Box mb={2}>
            <Checkbox.Item
              label={PO_AUTH_TO_PURCHASE_LABEL.fed}
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.FED)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.FED)}
              onChange={handleChangeValue}
              disabled={disabled}
            />
          </Box>
          <Box mb={2}>
            <Checkbox.Item
              label={PO_AUTH_TO_PURCHASE_LABEL.uni}
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.UNI)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.UNI)}
              onChange={handleChangeValue}
              disabled={disabled}
            />
          </Box>
          <Box mb={2}>
            <Checkbox.Item
              label={PO_AUTH_TO_PURCHASE_LABEL.multipleFederalSponsors}
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.MULTIPLE_FEDERAL_SPONSORS)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.MULTIPLE_FEDERAL_SPONSORS)}
              onChange={handleChangeValue}
              disabled={disabled}
            />
          </Box>
          <Grid item container>
            <Grid item xs={7}>
              <Box mb={2}>
                <Checkbox.Item
                  label={PO_AUTH_TO_PURCHASE_LABEL.costSharing}
                  {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.COST_SHARING)}
                  errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.COST_SHARING)}
                  onChange={handleChangeValue}
                  disabled={disabled}
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
                    disabled={disabled}
                  />
                </Grid>
                <span> {' / '} </span>
                <Grid item xs={1.5}>
                  <Input
                    maxLength={2}
                    errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.STATE_PERCENTAGE)}
                    {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.STATE_PERCENTAGE)}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mb={2}>
            <Checkbox.Item
              label={PO_AUTH_TO_PURCHASE_LABEL.ipe}
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.IPE)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.IPE)}
              onChange={handleChangeValue}
              disabled={disabled}
            />
          </Box>
          <Box mb={2}>
            <Checkbox.Item
              label={PO_AUTH_TO_PURCHASE_LABEL.dd}
              {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.DD)}
              errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.DD)}
              onChange={handleChangeValue}
              disabled={disabled}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Remarks</Typography>
          <TextareaAutosize
            maxLength={5000}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.REMARKS)}
            {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.REMARKS)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<POAuthToPurchasePayload>;
  disabled: boolean;
};

export default React.memo(CheckAndFill, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_AUTH_TO_PURCHASE_KEY.REQUIRES_PRIOR_APPROVAL,
    PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL,
    PO_AUTH_TO_PURCHASE_KEY.NOT_REQUIRES_PRIOR_APPROVAL_REASON,
    PO_AUTH_TO_PURCHASE_KEY.EQUIPMENT_TITLE_VESTED,
    PO_AUTH_TO_PURCHASE_KEY.FED,
    PO_AUTH_TO_PURCHASE_KEY.UNI,
    PO_AUTH_TO_PURCHASE_KEY.MULTIPLE_FEDERAL_SPONSORS,
    PO_AUTH_TO_PURCHASE_KEY.COST_SHARING,
    PO_AUTH_TO_PURCHASE_KEY.FEDERAL_PERCENTAGE,
    PO_AUTH_TO_PURCHASE_KEY.STATE_PERCENTAGE,
    PO_AUTH_TO_PURCHASE_KEY.IPE,
    PO_AUTH_TO_PURCHASE_KEY.DD,
    PO_AUTH_TO_PURCHASE_KEY.REMARKS,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<POAuthToPurchasePayload>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
