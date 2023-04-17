import { isVariousProject } from 'src/containers/PurchaseOrderContainer/GeneralInfo/helpers';
import { POPaymentEquipmentInventory, POPaymentLineItem, POPaymentResponse } from 'src/queries';
import { isPartialPOPayment } from 'src/queries/POPayment/helpers';
import { getDate } from 'src/utils';
import { isEmpty } from 'src/validations';
import {
  DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS,
  NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS_VALUES,
} from '../EquipmentInventoriesV2/helpers';
import { PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY, PO_PAYMENT_VENDOR_TYPE } from '../enums';
import { UpdatePOPaymentFormValue } from '../types';
import {
  ADVANCE_PAYMENT_BUDGET_CATEGORY,
  ADVANCE_PAYMENT_ITEM_PROJECT_NUMBER,
  initialPaymentLineItemValue,
  paymentEquipmentInventoryKeys,
} from './constants';

export const getPaymentLineItemFormValueByPaymentType = ({
  isAdvancePayment,
  response,
}: {
  isAdvancePayment: boolean;
  response: POPaymentResponse;
}): POPaymentLineItem[] => {
  if (!response) return;

  const { paymentType: responsePaymentType, paymentLineItems, projectNumber } = response;

  const isAdvancePaymentResponse = isPartialPOPayment(responsePaymentType);
  const isVariousPOProject = isVariousProject(projectNumber);

  if (isAdvancePayment) {
    if (isAdvancePaymentResponse) {
      return paymentLineItems.map((lineItem) => ({
        ...lineItem,
        serviceDate: getDate(lineItem.serviceDate),
        amount: Number(lineItem.amount || 0),
      }));
    } else {
      return [
        {
          ...initialPaymentLineItemValue,
          itemProjectNumber: ADVANCE_PAYMENT_ITEM_PROJECT_NUMBER,
          budgetCategory: ADVANCE_PAYMENT_BUDGET_CATEGORY,
        },
      ];
    }
  }

  const initialPaymentLineItem = {
    ...initialPaymentLineItemValue,
    itemProjectNumber: isVariousPOProject ? '' : projectNumber,
  };

  if (isAdvancePaymentResponse) {
    return [initialPaymentLineItem];
  } else {
    return paymentLineItems
      .map((lineItem) => ({
        ...lineItem,
        serviceDate: getDate(lineItem.serviceDate),
        amount: Number(lineItem.amount || 0),
      }))
      .concat(initialPaymentLineItem);
  }
};

export const getPaymentLineItemPayload = ({
  formValue,
}: {
  formValue: UpdatePOPaymentFormValue;
}) => {
  const { paymentType, advancePaymentLineItem, partialOrFinalPaymentLineItem } = formValue;
  const isAdvancePayment = isPartialPOPayment(paymentType);

  return isAdvancePayment ? advancePaymentLineItem : partialOrFinalPaymentLineItem.slice(0, -1);
};

export const checkVendorPaymentType = (type: PO_PAYMENT_VENDOR_TYPE) => {
  switch (type) {
    case PO_PAYMENT_VENDOR_TYPE.ACH:
    case PO_PAYMENT_VENDOR_TYPE.CARD:
    case PO_PAYMENT_VENDOR_TYPE.CHECK:
      return false;
    case PO_PAYMENT_VENDOR_TYPE.TBD:
      return true;
    default:
      return false;
  }
};

export const getNumberOfEquipmentInventories = (data: POPaymentEquipmentInventory[]) => {
  if (isEmpty(data)) return DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS;

  //find first number match the condition
  return NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS_VALUES.find((number) => number >= data.length);
};

export const getNumberOfTableEquipmentInventories = (numberOfItems: number) => {
  if (!numberOfItems) return 1;

  //find first number match the condition
  return (
    NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS_VALUES.findIndex((number) => number >= numberOfItems) + 1
  );
};

export const isNotEmptyPaymentEquipmentInventory = (inventory: POPaymentEquipmentInventory) => {
  if (!inventory) return false;

  return Object.entries(inventory).some(([key, value]) => {
    return (
      paymentEquipmentInventoryKeys.includes(key as PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY) &&
      !!value
    );
  });
};
