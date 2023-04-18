import { PO_CHANGE_FORM_NUMBER } from 'src/queries/POChange/enums';

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

export const getTypeOfPOChange = (formNumber: PO_CHANGE_FORM_NUMBER) => {
  switch (formNumber) {
    case PO_CHANGE_FORM_NUMBER.TOTAL_CANCELLATION_NUMBER:
      return 'Total Cancellation of P.O. Balance';
    case PO_CHANGE_FORM_NUMBER.CHANGE_DESCRIPTION_NUMBER:
      return 'Change descriptive portion of the P.O. without changes to the P.O. Balance';
    case PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_NUMBER:
      return 'Increase/Decrease Balance, change description, Budget Category, Project/Account Number';
    case PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_TERMINATED_NUMBER:
      return 'For Terminated Projects (Internal Purposes Only) - Decrease Balance, Change Description, Add New Project/Account Number';

    default:
      return 'Unknown';
  }
};
