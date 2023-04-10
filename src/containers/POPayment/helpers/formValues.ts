import { MyProfile, POPaymentResponse } from 'src/queries';
import { DateFormat, getDate, getDateDisplay, localTimeToHawaii } from 'src/utils';
import { UpdatePOPaymentFormValue } from '../types';

export const getPOPaymentFormValueFromResponse = ({
  response,
  profile,
}: {
  response: POPaymentResponse;
  profile: MyProfile;
}): UpdatePOPaymentFormValue => {
  const transformedLineItems = response.lineItems.map((lineItem) => ({
    ...lineItem,
    unitPrice: lineItem.unitPrice ? Number(lineItem.unitPrice || 0) : null,
    ext: Number(lineItem.unitPrice || 0),
  }));

  const transformedPaymentLineItems = response.paymentLineItems.map((lineItem) => ({
    ...lineItem,
    serviceDate: getDate(lineItem.serviceDate),
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

    paymentLineItems: transformedPaymentLineItems,
  };
};
