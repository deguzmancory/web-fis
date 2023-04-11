import { isVariousProject } from 'src/containers/PurchaseOrderContainer/GeneralInfo/helpers';
import { POPaymentLineItem, POPaymentResponse } from 'src/queries';
import { isPartialPOPayment } from 'src/queries/POPayment/helpers';
import { getDate } from 'src/utils';
import { UpdatePOPaymentFormValue } from '../types';
import {
  ADVANCE_PAYMENT_BUDGET_CATEGORY,
  ADVANCE_PAYMENT_ITEM_PROJECT_NUMBER,
  initialPaymentLineItemValue,
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
