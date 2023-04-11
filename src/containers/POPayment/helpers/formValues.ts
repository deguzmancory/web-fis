import { MyProfile, PO_PAYMENT_TYPE, POPaymentResponse } from 'src/queries';
import { DateFormat, getDateDisplay, localTimeToHawaii } from 'src/utils';
import { UpdatePOPaymentFormValue } from '../types';
import { getPaymentLineItemFormValueByPaymentType } from './utils';

export const getPOPaymentFormValueFromResponse = ({
  response,
  profile,
}: {
  response: POPaymentResponse;
  profile: MyProfile;
}): UpdatePOPaymentFormValue => {
  const responsePaymentType = response.paymentType || PO_PAYMENT_TYPE.PARTIAL_PAYMENT;

  const transformedLineItems = response.lineItems.map((lineItem) => ({
    ...lineItem,
    unitPrice: lineItem.unitPrice ? Number(lineItem.unitPrice || 0) : null,
    ext: Number(lineItem.unitPrice || 0),
  }));

  return {
    ...response,
    action: null,
    placeholderFileAttachment: null,

    paymentLoginName: response.paymentLoginName || profile.username,
    paymentDate: response.paymentDate
      ? getDateDisplay(response.paymentDate)
      : localTimeToHawaii(new Date(), DateFormat),
    paymentRequestNumber: response.paymentRequestNumber || 'To be assigned',
    paymentDirectInquiriesTo: response.paymentDirectInquiriesTo || '',
    paymentPhoneNumber: response.paymentPhoneNumber || '',
    paymentFaStaffReviewer: response.paymentFaStaffReviewer || '',

    date: getDateDisplay(response.date),
    taxTotal: Number(response.taxTotal || 0),
    subtotal: Number(response.subtotal || 0),
    taxRate: Number(response.taxRate || 0),
    total: Number(response.total || 0),
    shippingTotal: Number(response.shippingTotal || 0),
    lineItems: transformedLineItems,

    paymentType: responsePaymentType,

    partialOrFinalPaymentLineItem: getPaymentLineItemFormValueByPaymentType({
      response,
      isAdvancePayment: false,
    }),
    advancePaymentLineItem: getPaymentLineItemFormValueByPaymentType({
      response,
      isAdvancePayment: true,
    }),
  };
};
