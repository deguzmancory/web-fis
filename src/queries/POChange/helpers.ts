import { PO_CHANGE_FORM_NUMBER } from './enums';

export const isPOChangeTotalCancellationForm = (formNumber: PO_CHANGE_FORM_NUMBER) => {
  return formNumber === PO_CHANGE_FORM_NUMBER.TOTAL_CANCELLATION_NUMBER;
};

export const isPOChangeDescriptionForm = (formNumber: PO_CHANGE_FORM_NUMBER) => {
  return formNumber === PO_CHANGE_FORM_NUMBER.CHANGE_DESCRIPTION_NUMBER;
};

export const isPOChangeAmountForm = (formNumber: PO_CHANGE_FORM_NUMBER) => {
  return formNumber === PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_NUMBER;
};

export const isPOChangeAmountTerminatedForm = (formNumber: PO_CHANGE_FORM_NUMBER) => {
  return formNumber === PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_TERMINATED_NUMBER;
};
