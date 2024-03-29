import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { Input } from 'src/components/common';
import SignatureBox from 'src/containers/shared/SignatureBox';
import { Subcontractor } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_SUBCONTRACT_AGREEMENT_KEY } from '../enum';

const StandardsLayout: React.FC<Props> = ({ formikProps, disabled }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const _getErrorMessage = (fieldName: PO_SUBCONTRACT_AGREEMENT_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="h5" mb={1} textAlign={'center'}>
        STANDARDS OF CONDUCT DECLARATION
      </Typography>

      <Box>
        <Typography variant="body1" mb={1}>
          For the purposes of this declaration:
        </Typography>
        <Typography variant="body1" mb={1}>
          "Employee" means any nominated, appointed, or elected officer or employee of the State,
          including members of boards, commissions, and committees, and employee under contract to
          the State or of the Constitutional Convention, but excluding legislators, delegates to the
          Constitutional Convention, justices and judges. "Controlling interest" means an interest
          in a business or other undertaking which is sufficient in fact to control, whether the
          interest be greater or less than fifty per cent.
        </Typography>

        <div style={{ display: 'contents' }}>
          <div style={{ display: 'contents' }}>On behalf of </div>
          <div style={{ display: 'inline-block', width: '60%' }}>
            <Input
              errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_NAME)}
              {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_NAME)}
              disabled={disabled}
            />
          </div>
          <div style={{ display: 'contents' }}> </div>
        </div>

        <ol style={{ padding: '0 16px' }}>
          <li>
            SUBCONTRACTOR (is) (is not) a legislator or an employee or a business in which a
            legislator or an employee has a "controlling interest".
          </li>
          <li>
            SUBCONTRACTOR has not been assisted or represented by a legislator or employee for a fee
            or other compensation to obtain this Agreement and will not be assisted or represented
            by a legislator or employee for a fee or other compensation in the performance of the
            Agreement, if the legislator or employee had been involved in the development or award
            of the Agreement.
          </li>
          <li>
            SUBCONTRACTOR has not been assisted or represented for a fee or other compensation in
            the award of this Agreement by a RCUH employee, or in the case of the Legislature, by a
            legislator.
          </li>
          <li>
            SUBCONTRACTOR has not been represented or assisted personally on matters related to the
            Agreement by a person who has been an employee of the RCUH within the preceding two
            years and who participated while in state office or employment on the matter with which
            the contract is directly concerned.
          </li>
          <li>
            SUBCONTRACTOR has not been represented or assisted on matters related to the Agreement,
            for a fee or other consideration by an individual who, within the past twelve months,
            has been a RCUH employee.
          </li>
          <li>
            SUBCONTRACTOR has not been represented or assisted in the award of this Agreement for a
            fee or other consideration by an individual who, (a) within the past twelve months,
            served as a RCUH employee, and (b) participated while an employee on matters related to
            this Agreement.
          </li>
        </ol>

        <Box mt={3}>
          <Typography variant="body1">SUBCONTRACTOR</Typography>

          <SignatureBox
            maxWidth={'50%'}
            {...getFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_DATE)}
            nameDate={PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_DATE}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            selected={values.socSubcontractorDate as Date}
            disabled={disabled}
          />

          <Grid container flexDirection={'column'} xs={6} spacing={2} mt={1}>
            <Grid item>
              <Input
                label={'Full Name of Subcontractor'}
                errorMessage={_getErrorMessage(
                  PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_SIGNATURE
                )}
                {...getUncontrolledFieldProps(
                  PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_SIGNATURE
                )}
                disabled={disabled}
              />
            </Grid>
            <Grid item>
              <Input
                label={'Subcontractor Title'}
                errorMessage={_getErrorMessage(
                  PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_TITLE
                )}
                disabled={disabled}
                {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_TITLE)}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

type Props = {
  formikProps: CommonFormikProps<Subcontractor>;
  disabled: boolean;
};

export default React.memo(StandardsLayout, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_NAME,
    PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_DATE,
    PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_SIGNATURE,
    PO_SUBCONTRACT_AGREEMENT_KEY.SOC_SUBCONTRACTOR_TITLE,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<Subcontractor>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
