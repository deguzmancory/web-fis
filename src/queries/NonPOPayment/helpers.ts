import { NON_PO_PAYMENT_DOCUMENT_TYPE } from './enums';

export const isNonPOAuthorizationPaymentType = (
  currentNonPOPaymentDocumentType: NON_PO_PAYMENT_DOCUMENT_TYPE
) => {
  return currentNonPOPaymentDocumentType === NON_PO_PAYMENT_DOCUMENT_TYPE.AUTHORIZATION_PAYMENT;
};
export const isNonPOEmployeeTravelPaymentType = (
  currentNonPOPaymentDocumentType: NON_PO_PAYMENT_DOCUMENT_TYPE
) => {
  return (
    currentNonPOPaymentDocumentType === NON_PO_PAYMENT_DOCUMENT_TYPE.NON_EMPLOYEE_TRAVEL_PAYMENT
  );
};
export const isNonPOPersonalAutoPaymentType = (
  currentNonPOPaymentDocumentType: NON_PO_PAYMENT_DOCUMENT_TYPE
) => {
  return currentNonPOPaymentDocumentType === NON_PO_PAYMENT_DOCUMENT_TYPE.PERSONAL_AUTO_PAYMENT;
};
export const isNonPOPettyCashPaymentType = (
  currentNonPOPaymentDocumentType: NON_PO_PAYMENT_DOCUMENT_TYPE
) => {
  return currentNonPOPaymentDocumentType === NON_PO_PAYMENT_DOCUMENT_TYPE.PETTY_CASH_PAYMENT;
};
export const isNonPOMultiTravelPaymentType = (
  currentNonPOPaymentDocumentType: NON_PO_PAYMENT_DOCUMENT_TYPE
) => {
  return currentNonPOPaymentDocumentType === NON_PO_PAYMENT_DOCUMENT_TYPE.MULTI_TRAVEL_PAYMENT;
};
export const isNonPOReimbursementPaymentType = (
  currentNonPOPaymentDocumentType: NON_PO_PAYMENT_DOCUMENT_TYPE
) => {
  return currentNonPOPaymentDocumentType === NON_PO_PAYMENT_DOCUMENT_TYPE.REIMBURSEMENT_PAYMENT;
};
