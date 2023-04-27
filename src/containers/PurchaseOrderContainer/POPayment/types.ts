import {
  FinancialProject,
  POGeneralInfo,
  POLineItem,
  POPaymentLineItem,
  POPaymentRemainingBalanceItemList,
  POPaymentRemittanceLineItem,
  POPurchaseInfo,
  UpdatePOPaymentPayload,
} from 'src/queries';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { POPlaceholderFileAttachment } from '../PO/types';

export interface POPaymentLineItemFormValue extends Omit<POPaymentLineItem, 'itemProjectNumber'> {
  itemProjectNumber: string | FinancialProject;
}
export interface UpdatePOPaymentFormValue
  extends POGeneralInfo,
    POPurchaseInfo,
    Omit<UpdatePOPaymentPayload, 'paymentLineItems'> {
  // po line items
  lineItems: POLineItem[];

  //payment summary
  advancePaymentLineItem: POPaymentLineItemFormValue[];
  partialOrFinalPaymentLineItem: POPaymentLineItemFormValue[];
  remittanceLineItems: POPaymentRemittanceLineItem[];

  //po remaining balance
  remainingBalance: number;
  remainingBalanceLineItems: POPaymentRemainingBalanceItemList[];
  remainingBalanceAsOfDate: string;

  //attachments
  placeholderFileAttachment: POPlaceholderFileAttachment;

  //equipment inventories
  paymentNumberOfEquipmentInventories: number;
}

export type UpdatePOPaymentFormikProps = CommonFormikProps<UpdatePOPaymentFormValue>;
