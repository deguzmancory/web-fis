import { Box, BoxProps, Divider, Grid, Typography } from '@mui/material';
import { FormikErrors } from 'formik';
import React from 'react';
import { DatePicker } from 'src/components/common';

const SignatureBox: React.FC<Props> = ({
  nameDate,
  valueDate,
  selected,
  disabled = false,
  setFieldValue,
  setFieldTouched,

  ...props
}) => {
  return (
    <Box pt={12} {...props}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={7}>
          <Divider />
        </Grid>
        <Grid item xs={5}>
          {nameDate ? (
            <DatePicker
              name={nameDate}
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              selected={selected}
              disabled={disabled}
            />
          ) : (
            <Divider />
          )}
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body2">Signature</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="body2">Date</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = BoxProps & {
  nameDate?: string;
  valueDate?: any;
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<any>>;
  setFieldTouched?: (
    field: string,
    touched?: boolean,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<any>>;
  selected?: Date;
  disabled?: boolean;
};

export default React.memo(SignatureBox);
