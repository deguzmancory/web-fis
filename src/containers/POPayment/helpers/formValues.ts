import { MyProfile, POPaymentRemainingBalance, POPaymentResponse } from 'src/queries';
import { DateFormat, getDate, getDateDisplay, localTimeToHawaii } from 'src/utils';
import { isEmpty } from 'src/validations';
import { UpdatePOPaymentFormValue } from '../types';
import {
  emptyUpdatePOPaymentFormValue,
  initialPaymentEquipmentInventory,
  initialPaymentRemittanceInfo,
} from './constants';
import { getPaymentLineItemFormValueByPaymentType } from './utils';

export const getPOPaymentFormValueFromResponse = ({
  poPaymentResponse,
  remainingBalanceResponse,
  profile,
}: {
  poPaymentResponse: POPaymentResponse;
  remainingBalanceResponse: POPaymentRemainingBalance[];
  profile: MyProfile;
}): UpdatePOPaymentFormValue => {
  const transformedLineItems = poPaymentResponse.lineItems.map((lineItem) => ({
    ...lineItem,
    unitPrice: lineItem.unitPrice ? Number(lineItem.unitPrice || 0) : null,
    ext: Number(lineItem.unitPrice || 0),
  }));

  const transformedPaymentEquipmentInventories = !isEmpty(
    poPaymentResponse.paymentEquipmentInventories
  )
    ? poPaymentResponse.paymentEquipmentInventories.map((equipmentInventory) => ({
        ...equipmentInventory,
        receiveDate: getDate(equipmentInventory.receiveDate),
      }))
    : [initialPaymentEquipmentInventory];

  return {
    ...poPaymentResponse,
    action: null,
    placeholderFileAttachment: null,

    paymentLoginName: poPaymentResponse.paymentLoginName || profile.username,
    paymentDate: poPaymentResponse.paymentDate
      ? getDateDisplay(poPaymentResponse.paymentDate)
      : localTimeToHawaii(new Date(), DateFormat),
    paymentRequestNumber: poPaymentResponse.paymentRequestNumber || 'To be assigned',
    paymentDirectInquiriesTo: poPaymentResponse.paymentDirectInquiriesTo || '',
    paymentPhoneNumber: poPaymentResponse.paymentPhoneNumber || '',
    paymentFaStaffReviewer: poPaymentResponse.paymentFaStaffReviewer || '',

    date: getDateDisplay(poPaymentResponse.date),
    taxTotal: Number(poPaymentResponse.taxTotal || 0),
    subtotal: Number(poPaymentResponse.subtotal || 0),
    taxRate: Number(poPaymentResponse.taxRate || 0),
    total: Number(poPaymentResponse.total || 0),
    shippingTotal: Number(poPaymentResponse.shippingTotal || 0),
    lineItems: transformedLineItems,

    partialOrFinalPaymentLineItem: getPaymentLineItemFormValueByPaymentType({
      response: poPaymentResponse,
      isAdvancePayment: false,
    }),
    advancePaymentLineItem: getPaymentLineItemFormValueByPaymentType({
      response: poPaymentResponse,
      isAdvancePayment: true,
    }),
    paymentTotal: Number(poPaymentResponse.paymentTotal || 0),
    remainingBalance: 100, //TODO: Tuyen Tran replace with remainingBalanceResponse

    paymentEquipmentInventories: transformedPaymentEquipmentInventories,
    remittanceLineItems: !isEmpty(poPaymentResponse.remittanceLineItems)
      ? poPaymentResponse.remittanceLineItems
      : [initialPaymentRemittanceInfo],
    remittance: !isEmpty(poPaymentResponse.remittance)
      ? poPaymentResponse.remittance
      : emptyUpdatePOPaymentFormValue.remittance,
  };
};
