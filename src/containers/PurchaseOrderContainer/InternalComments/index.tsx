import { Box, Grid } from '@mui/material';
import React from 'react';
import { TextareaAutosize } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps, UpsertPOFormValue } from '../types';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/POPayment/types';

const InternalComments = <T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps>({
  formikProps,
  disabled = false,
}: Props<T>) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <TextareaAutosize
            label={'Internal Comments'}
            errorMessage={_getErrorMessage(PO_FORM_KEY.PO_COMMENTS)}
            {...getUncontrolledFieldProps(PO_FORM_KEY.PO_COMMENTS)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props<T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps> = {
  formikProps: T extends UpsertPOFormikProps ? UpsertPOFormikProps : UpdatePOPaymentFormikProps;
  disabled?: boolean;
};

export default React.memo(InternalComments, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<UpsertPOFormValue | UpdatePOPaymentFormValue>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [PO_FORM_KEY.PO_COMMENTS],
    })
  );
});
