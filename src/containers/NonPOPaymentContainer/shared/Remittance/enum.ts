export enum NON_PO_PAYMENT_REMITTANCE_KEY {
  REMITTANCE_LINE_ITEMS = 'remittanceLineItems',
  REMITTANCE = 'remittance',
}

export enum NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY {
  REFERENCE_NUMBER = 'referenceNumber',
  CUSTOMER_ACCOUNT_COMMENT = 'customerAccountComment',
  AMOUNT = 'amount',
}

export enum NON_PO_PAYMENT_REMITTANCE_QUESTIONS_KEY {
  QUESTION_NAME = 'questionName',
  QUESTION_PHONE_NUMBER = 'questionPhoneNumber',
  RETURN_REMITTANCE_FLAG = 'returnRemittanceFlag',
  REMITTANCE_ATTENTION = 'remittanceAttention',
  REMITTANCE_STREET = 'remittanceStreet',
  REMITTANCE_CITY = 'remittanceCity',
  REMITTANCE_STATE = 'remittanceState',
  ZIP_CODE = 'zipCode',
  ZIP_CODE_PLUS4 = 'zipCodePlus4',
  REMITTANCE_TOTAL = 'remittanceTotal',
}

export const nonPoPaymentLineItemsRemittanceColumnsNames = [
  NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.REFERENCE_NUMBER,
  NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.CUSTOMER_ACCOUNT_COMMENT,
  NON_PO_PAYMENT_REMITTANCE_LINE_ITEM_KEY.AMOUNT,
];

export interface NonPoPaymentRemittanceLineItem {
  id?: string;
  referenceNumber: string;
  customerAccountComment: string;
  amount: number;

  externalId?: number;
  createdAt?: string;
  updatedAt?: string;
}
