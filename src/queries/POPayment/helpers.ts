import { PO_PAYMENT_TYPE } from './enums';

export const isPartialPOPayment = (paymentType: PO_PAYMENT_TYPE) => {
  return paymentType === PO_PAYMENT_TYPE.PARTIAL_PAYMENT;
};
export const isFinalPOPayment = (paymentType: PO_PAYMENT_TYPE) => {
  return paymentType === PO_PAYMENT_TYPE.FINAL_PAYMENT;
};
export const isAdvancePOPayment = (paymentType: PO_PAYMENT_TYPE) => {
  return paymentType === PO_PAYMENT_TYPE.ADVANCE_PAYMENT;
};
