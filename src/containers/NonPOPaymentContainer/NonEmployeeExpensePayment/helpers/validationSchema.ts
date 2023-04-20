import { PO_ACTION } from 'src/queries';
// import { isSubmitAction } from 'src/queries/PurchaseOrders/helpers';
import { Yup } from 'src/services';

export const getNonEmployeeTravelFormValidationSchema = ({ action }: { action: PO_ACTION }) => {
  // const isSubmitPOAction = isSubmitAction(action);

  return Yup.object().shape({});
};
