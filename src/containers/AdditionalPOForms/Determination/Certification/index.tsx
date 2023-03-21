import { Box, Typography } from '@mui/material';
import React from 'react';
import { EllipsisTooltipInput, Link } from 'src/components/common';
import SignatureBox from 'src/containers/shared/SignatureBox';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_CERTIFICATE_KEY } from './enum';

const Certification: React.FC<Props> = ({ formikProps, haveRequestText }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const _getErrorMessage = (fieldName: PO_CERTIFICATE_KEY) => {
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
              errorMessage={_getErrorMessage(PO_CERTIFICATE_KEY.DEPARTMENT_HEAD)}
              {...getUncontrolledFieldProps(PO_CERTIFICATE_KEY.DEPARTMENT_HEAD)}
            />
          </Box>
          <SignatureBox
            maxWidth={'50%'}
            {...getFieldProps(PO_CERTIFICATE_KEY.DEPARTMENT_HEAD_DATE)}
            nameDate={PO_CERTIFICATE_KEY.DEPARTMENT_HEAD_DATE}
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
            errorMessage={_getErrorMessage(PO_CERTIFICATE_KEY.APPROVED_DUO)}
            {...getUncontrolledFieldProps(PO_CERTIFICATE_KEY.APPROVED_DUO)}
          />
        </Box>
        <SignatureBox
          maxWidth={'50%'}
          {...getFieldProps(PO_CERTIFICATE_KEY.APPROVED_DUO_DATE)}
          nameDate={PO_CERTIFICATE_KEY.APPROVED_DUO_DATE}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          selected={values.approvedDuoDate}
        />
      </Box>

      {haveRequestText ? (
        <Typography variant="body2" mt={4}>
          Requests for non-competitive purchases utilizing federal contract funds in excess of
          $750,000 must also be accompanied by cost or pricing data and a certification (refer to{' '}
          <Link target="_blank" href="https://www.rcuh.com/2-000/2-300/2-303/">
            Policy 2.303
          </Link>{' '}
          Certification Statements Required for Federal Purchases).
        </Typography>
      ) : null}
    </>
  );
};

type Props = {
  // TODO: Tuyen Tran add type for payload
  formikProps: CommonFormikProps<any>;
  haveRequestText: Boolean;
};

export default React.memo(Certification, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_CERTIFICATE_KEY.DEPARTMENT_HEAD,
    PO_CERTIFICATE_KEY.DEPARTMENT_HEAD_DATE,
    PO_CERTIFICATE_KEY.APPROVED_DUO,
    PO_CERTIFICATE_KEY.APPROVED_DUO_DATE,
  ];

  return isEqualPrevAndNextFormikValues<any>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
