import { PO_ACTION } from 'src/queries';
import { Yup } from 'src/services';

export const getAuthorizationPaymentFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  return Yup.object().shape({});
};
