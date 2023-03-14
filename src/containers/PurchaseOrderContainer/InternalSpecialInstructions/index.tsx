import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link, RadioButton, TextareaAutosize } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps, UpsertPOFormValue } from '../types';
import { recordOfCompetitionOptions } from './helpers';

const InternalSpecialInstructions: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="h5" mb={1}>
        Internal Special Instructions (Not printed on PO)
      </Typography>

      <Divider />

      <Grid container spacing={2} sx={{ pt: 2 }}>
        <Grid item xs={4}>
          <RadioButton
            subLabel={
              //TODO: huy_dang add link explain
              <Typography fontWeight="bold" variant="h5" mb={1}>
                A. Record of Competition <Link textVariant="h6">explain</Link>
              </Typography>
            }
            columns={1}
            options={recordOfCompetitionOptions}
            {...getFieldProps(PO_FORM_KEY.INTERNAL_A)}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INTERNAL_A)}
            onChange={setFieldValue}
            itemClassName="mb-except-last-8"
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography fontWeight="bold" variant="h6" mb={1}>
            Vendor/Amount
          </Typography>
          <TextareaAutosize
            {...getUncontrolledFieldProps(PO_FORM_KEY.INTERNAL_A1)}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INTERNAL_A1)}
            minRows={2}
            disabled={disabled}
          />
        </Grid>
        {/* TODO: huy_dang add link explain */}
        <Grid item xs={4}>
          <Typography fontWeight="bold" variant="h5" mb={1}>
            B. Confirming Purchase Order <Link textVariant="h6">explain</Link>
          </Typography>
          <Typography variant="body2">(Provide Justification)</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextareaAutosize
            {...getUncontrolledFieldProps(PO_FORM_KEY.INTERNAL_B)}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INTERNAL_B)}
            minRows={2}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography fontWeight="bold" variant="h5" mb={1}>
            C. Other Information
          </Typography>
          <Typography variant="body2">(Initial PI comments to FA)</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextareaAutosize
            {...getUncontrolledFieldProps(PO_FORM_KEY.INTERNAL_C)}
            errorMessage={_getErrorMessage(PO_FORM_KEY.INTERNAL_C)}
            minRows={2}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

interface Props {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
}

export default React.memo(InternalSpecialInstructions, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_FORM_KEY.INTERNAL_A,
    PO_FORM_KEY.INTERNAL_A1,
    PO_FORM_KEY.INTERNAL_B,
    PO_FORM_KEY.INTERNAL_C,
  ]; // only re-render if keys using in this component change

  return isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
