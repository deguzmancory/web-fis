import { memo } from 'react';
import { Box } from '@mui/material';
import { isEqualPrevAndNextFormikValues } from 'src/utils';
import { AUTHORIZATION_FOR_PAYMENT_KEY } from '../enum';
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

export default memo(Remittance, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    AUTHORIZATION_FOR_PAYMENT_KEY.REMITTANCE_LINE_ITEMS,
    AUTHORIZATION_FOR_PAYMENT_KEY.REMITTANCE,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
