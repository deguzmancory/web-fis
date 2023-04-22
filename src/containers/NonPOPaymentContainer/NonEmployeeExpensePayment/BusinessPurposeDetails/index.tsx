import { Box, Grid, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { Input, TextareaAutosize } from 'src/components/common';
import RequiredSign from 'src/containers/shared/RequiredSign';
import SignatureBox from 'src/containers/shared/SignatureBox';
import { PO_MODE } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { NON_EMPLOYEE_TRAVEL_FORM_KEY } from '../enums';
import { UpsertNonEmployeeTravelFormikProps } from '../types';

const BusinessPurposeDetails: FC<Props> = ({ formikProps, disabled = false }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: NON_EMPLOYEE_TRAVEL_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="body2">
        Business Purpose Details (Category (1) Payee) <RequiredSign />
      </Typography>

      <Box mt={2}>
        <TextareaAutosize
          label={
            'State the services provided, including how and why they are needed by the project. Include details of the activity (location, duties, etc.)'
          }
          errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.TRAVEL_DETAILS)}
          {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.TRAVEL_DETAILS)}
          disabled={disabled}
        />
      </Box>

      <Box mt={2}>
        <Typography variant="body2">Category (1) payee claimant</Typography>
        <ul style={{ listStyle: 'inside' }}>
          <li>
            <Typography variant="body2" component={'span'}>
              The expense claimed may <b>be excluded from</b> income if it qualifies as a business
              expense and IRS Accountable Plan Rules are met. If these requirements are met, the
              payment is not income to the payee, and is not subject to tax reporting or
              withholding.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" component={'span'}>
              If a payment does not qualify as a business expense, it is income to the payee, and
              may be subject to tax withholding and/or tax reporting.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" component={'span'}>
              The expenses have not yet been, and will not again be, submitted to RCUH or any other
              organization for reimbursement or for tax purposes.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" component={'span'}>
              My signature below: (a) certifies that the information stated on this form is true and
              correct, and that all expenses claimed in the “Claim Due” field above have been
              incurred with personal funds; and (b) indicates my acknowledgement and agreement to
              the above terms.
            </Typography>
          </li>
        </ul>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SignatureBox />
          <Box mt={1}>
            <Input
              label={'Claimant'}
              required
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.CLAIMANT_SIGNATURE)}
              {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.CLAIMANT_SIGNATURE)}
              disabled={disabled}
              maxLength={45}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            <b>PROJECT PAYMENT APPROVAL:</b> I certify that the expenses are in direct support of
            the project(s) charged.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <SignatureBox />
          <Box mt={1}>
            <Input
              label={'Principal Investigator'}
              required
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.PI_SIGNATURE)}
              {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.PI_SIGNATURE)}
              disabled={disabled}
              maxLength={45}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <SignatureBox />
          <Box mt={1}>
            <Input
              label={'Fiscal Administrator'}
              required
              errorMessage={_getErrorMessage(NON_EMPLOYEE_TRAVEL_FORM_KEY.FA_SIGNATURE)}
              {...getUncontrolledFieldProps(NON_EMPLOYEE_TRAVEL_FORM_KEY.FA_SIGNATURE)}
              disabled={disabled}
              maxLength={45}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertNonEmployeeTravelFormikProps;
  disabled?: boolean;
  currentMode: PO_MODE;
};

export default memo(BusinessPurposeDetails, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    NON_EMPLOYEE_TRAVEL_FORM_KEY.TRAVEL_DETAILS,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.CLAIMANT_SIGNATURE,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.PI_SIGNATURE,
    NON_EMPLOYEE_TRAVEL_FORM_KEY.FA_SIGNATURE,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentMode === nextProps.currentMode &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
