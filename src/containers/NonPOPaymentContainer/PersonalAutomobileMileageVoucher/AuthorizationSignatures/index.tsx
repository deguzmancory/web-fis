import { Box, Grid } from '@mui/material';
import { FC, memo } from 'react';
import { Input } from 'src/components/common';
import { PO_MODE } from 'src/queries';
import { getErrorMessage } from 'src/utils';
import SignatureBox from '../../../shared/SignatureBox';
import { PERSONAL_AUTOMOBILE_FORM_KEY } from '../enums';
import { PersonalAutomobileFormikProps } from '../types';

const GeneralInfo: FC<Props> = ({ formikProps, disabled = false, currentMode }) => {
  const { getUncontrolledFieldProps, touched, errors } = formikProps;

  const _getErrorMessage = (fieldName: PERSONAL_AUTOMOBILE_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SignatureBox />
          <Box mt={1}>
            <Input
              label={'Traveler'}
              errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.TRAVELER_SIGNATURE)}
              {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.TRAVELER_SIGNATURE)}
              required
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SignatureBox />
              <Box mt={1}>
                <Input
                  label={'Principal Investigator'}
                  errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.PI_SIGNATURE)}
                  {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.PI_SIGNATURE)}
                  required
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <SignatureBox />
              <Box mt={1}>
                <Input
                  label={'Fiscal Administrator'}
                  errorMessage={_getErrorMessage(PERSONAL_AUTOMOBILE_FORM_KEY.UH_SIGNATURE)}
                  {...getUncontrolledFieldProps(PERSONAL_AUTOMOBILE_FORM_KEY.UH_SIGNATURE)}
                  required
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: PersonalAutomobileFormikProps;
  disabled?: boolean;
  currentMode: PO_MODE;
};

// Always need the latest formikProps to jump to vendor page without losing data
export default memo(GeneralInfo);
