import { Box, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { RadioButton, TextareaAutosize } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextObjByPath } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import InfoTooltip from '../../shared/InfoTooltip';
import { UpsertPOFormikProps } from '../types';
import { presetInstructionOptions } from './helpers';

const ExternalSpecialInstructions: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" mb={1}>
        <Typography variant="h5" sx={{ mr: '4px' }}>
          External Special Instructions (Printed on PO)
        </Typography>
        <InfoTooltip title="The section will be printed on the PO" />
      </Stack>

      <Divider />

      <RadioButton
        columns={1}
        options={presetInstructionOptions}
        {...getFieldProps(PO_FORM_KEY.PRESET_INSTRUCTIONS)}
        errorMessage={_getErrorMessage(PO_FORM_KEY.PRESET_INSTRUCTIONS)}
        onChange={setFieldValue}
        itemClassName="mb-except-last-8"
        containerClassName="mt-16"
        disabled={disabled}
      />

      <TextareaAutosize
        {...getUncontrolledFieldProps(PO_FORM_KEY.EXTERNAL_SPECIAL_INSTRUCTIONS)}
        errorMessage={_getErrorMessage(PO_FORM_KEY.EXTERNAL_SPECIAL_INSTRUCTIONS)}
        minRows={2}
        style={{
          width: '65%',
        }}
        disabled={disabled}
      />
    </Box>
  );
};

interface Props {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
}

export default React.memo(ExternalSpecialInstructions, (prevProps, nextProps) => {
  const prevFormikValues = prevProps.formikProps.values;
  const nextFormikValues = nextProps.formikProps.values;

  const formKeysNeedRender = [
    PO_FORM_KEY.PRESET_INSTRUCTIONS,
    PO_FORM_KEY.EXTERNAL_SPECIAL_INSTRUCTIONS,
  ]; // only re-render if keys using in this component change

  return formKeysNeedRender.every((key) =>
    isEqualPrevAndNextObjByPath({
      prevValues: prevFormikValues,
      nextValues: nextFormikValues,
      path: key,
    })
  );
});
