import { Box } from '@mui/material';
import { UpsertAuthorizationPaymentFormikProps } from '../types';
import LineItem from './LineItems';
import Question from './Questions';

const Remittance: React.FC<Props> = ({ formikProps, disabled = false }) => {
  return (
    <Box>
      <LineItem formikProps={formikProps} disabled={disabled} />
      <Question formikProps={formikProps} disabled={disabled} />
    </Box>
  );
};

type Props = {
  formikProps: UpsertAuthorizationPaymentFormikProps;
  disabled?: boolean;
};

export default Remittance;
