import {
  MyProfile,
  POPaymentRemainingBalance,
  POPaymentResponse,
  PO_ACTION,
  UpdatePOPaymentPayload,
} from 'src/queries';
import { isPartialPOPayment } from 'src/queries/POPayment/helpers';
import { DateFormat, getDate, getDateDisplay, localTimeToHawaii } from 'src/utils';
import { isEmpty } from 'src/validations';
import { DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS } from '../EquipmentInventoriesV2/helpers';
import { UpdatePOPaymentFormValue } from '../types';
import {
  emptyUpdatePOPaymentFormValue,
  getInitialPaymentEquipmentInventories,
  initialPaymentRemittanceInfo,
} from './constants';
import { getNumberOfEquipmentInventories, getPaymentLineItemFormValueByPaymentType } from './utils';

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
      })) || []
    : getInitialPaymentEquipmentInventories(DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS);

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
    paymentNumberOfEquipmentInventories: getNumberOfEquipmentInventories(
      transformedPaymentEquipmentInventories
    ),

    remittanceLineItems: !isEmpty(poPaymentResponse.remittanceLineItems)
      ? [...poPaymentResponse.remittanceLineItems, initialPaymentRemittanceInfo]
      : [initialPaymentRemittanceInfo],
    remittance: !isEmpty(poPaymentResponse.remittance)
      ? poPaymentResponse.remittance
      : emptyUpdatePOPaymentFormValue.remittance,
  };
};

export const getUpdatePOPaymentPayload = ({
  formValues,
  action,
}: {
  formValues: UpdatePOPaymentFormValue;
  action: PO_ACTION;
}): UpdatePOPaymentPayload => {
  const isAdvancePaymentResponse = isPartialPOPayment(formValues.paymentType);

  const {
    advancePaymentLineItem,
    partialOrFinalPaymentLineItem,
    paymentNumberOfEquipmentInventories,
    paymentEquipmentInventories,
    placeholderFileAttachment,
    remainingBalance,
    ...payloadProps
  } = formValues;

  return {
    ...payloadProps,
    action,
    paymentLineItems: isAdvancePaymentResponse
      ? advancePaymentLineItem
      : partialOrFinalPaymentLineItem.slice(0, -1),
    paymentEquipmentInventories: paymentEquipmentInventories.slice(
      0,
      paymentNumberOfEquipmentInventories
    ),
  };
};
