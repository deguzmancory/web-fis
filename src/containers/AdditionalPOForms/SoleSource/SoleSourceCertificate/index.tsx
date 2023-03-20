import { Box, Typography } from '@mui/material';
import React from 'react';
import { EllipsisTooltipInput } from 'src/components/common';
import SignatureBox from 'src/containers/shared/SignatureBox';
import { POSoleSourcePayload } from 'src/queries/PurchaseOrders';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_SOLE_SOURCE_FORM_KEY } from '../enum';

const SoleSourceCertificate: React.FC<Props> = ({ formikProps }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const _getErrorMessage = (fieldName: PO_SOLE_SOURCE_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <>
      <Box mb={4}>
        <Typography variant="h5" mb={1}>
          CERTIFICATION:
        </Typography>
        <Typography variant="body2">
          I certify that the information provided above is true and correct to the best of my
          knowledge.
        </Typography>

        <Box>
          <Typography variant="body2" mt={3}>
            Principal Investigator, Department Head, or Administrator
          </Typography>
          <Box maxWidth={'50%'}>
            <EllipsisTooltipInput
              maxLength={250}
              lengthShowTooltip={70}
              errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT_HEAD)}
              {...getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT_HEAD)}
            />
          </Box>
          <SignatureBox
            maxWidth={'50%'}
            {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT_HEAD_DATE)}
            nameDate={PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT_HEAD_DATE}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            selected={values.departmentHeadDate}
          />
        </Box>
      </Box>

      <Typography variant="h5" mb={2}>
        APPROVED:
      </Typography>

      <Box>
        <Typography variant="body2">DUO / Fiscal Administrator</Typography>
        <Box maxWidth={'50%'}>
          <EllipsisTooltipInput
            maxLength={250}
            lengthShowTooltip={70}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.APPROVED_DUO)}
            {...getUncontrolledFieldProps(PO_SOLE_SOURCE_FORM_KEY.APPROVED_DUO)}
          />
        </Box>
        <SignatureBox
          maxWidth={'50%'}
          {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.APPROVED_DUO_DATE)}
          nameDate={PO_SOLE_SOURCE_FORM_KEY.APPROVED_DUO_DATE}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          selected={values.approvedDuoDate}
        />
      </Box>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<POSoleSourcePayload>;
};

export default React.memo(SoleSourceCertificate, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT_HEAD,
    PO_SOLE_SOURCE_FORM_KEY.DEPARTMENT_HEAD_DATE,
    PO_SOLE_SOURCE_FORM_KEY.APPROVED_DUO,
    PO_SOLE_SOURCE_FORM_KEY.APPROVED_DUO_DATE,
  ];

  return isEqualPrevAndNextFormikValues<POSoleSourcePayload>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
