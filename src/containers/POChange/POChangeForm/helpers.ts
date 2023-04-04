import { PO_CHANGE_FORM_NUMBER } from '../SelectChangeFormType/enums';

export const getPoChangeFormTitle = (formNumber: PO_CHANGE_FORM_NUMBER) => {
  switch (formNumber) {
    case PO_CHANGE_FORM_NUMBER.TOTAL_CANCELLATION_NUMBER:
      return '(Total Cancellation)';
    case PO_CHANGE_FORM_NUMBER.CHANGE_DESCRIPTION_NUMBER:
      return '(Description Change Only)';
    case PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_NUMBER:
      return '(Increase/Decrease Balance)';
    case PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_TERMINATED_NUMBER:
      return '(Terminated Project)';

    default:
      return '(UNKNOWN FORM)';
  }
};
