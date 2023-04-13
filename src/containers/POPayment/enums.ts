export enum PO_PAYMENT_FORM_QUERY_KEY {
  SCROLL_TO = 'scrollTo',
}

export enum PO_PAYMENT_LINE_ITEM_KEY {
  ITEM_PROJECT_NUMBER = 'itemProjectNumber',
  SUB_PROJECT = 'subProject',
  BUDGET_CATEGORY = 'budgetCategory',
  SUB_BUDGET_CATEGORY = 'subBudgetCategory',
  SERVICE_DATE = 'serviceDate',
  AMOUNT = 'amount',
}

export enum PO_PAYMENT_EQUIPMENT_INVENTORY_ITEM_KEY {
  DESCRIPTION = 'description',
  BRAND_NAME = 'brandName',
  SERIAL_NUMBER = 'serialNumber',
  ITEM_COST = 'itemCost',
  LOCATION_OF_EQUIPMENT = 'locationOfEquipment',
  OWNERSHIP = 'ownership',
  PREPARER_NAME = 'preparerName',
  PREPARER_PHONE = 'preparerPhone',
  COMPONENT = 'component',
  FABRICATED_A = 'fabricatedA',
  FABRICATED_B = 'fabricatedB',
  RECEIVE_DATE = 'receiveDate',
}

export enum PO_PAYMENT_REMITTANCE_LINE_ITEM {
  REFERENCE_NUMBER = 'referenceNumber',
  CUSTOMER_ACCOUNT_COMMENT = 'customerAccountComment',
  AMOUNT = 'amount',
}

export enum PO_PAYMENT_REMITTANCE_KEY {
  QUESTION_NAME = 'questionName',
  QUESTION_PHONE_NUMBER = 'questionPhoneNumber',
  REMITTANCE_ATTENTION = 'remittanceAttention',
  REMITTANCE_CITY = 'remittanceCity',
  REMITTANCE_STATE = 'remittanceState',
  REMITTANCE_STREET = 'remittanceStreet',
  REMITTANCE_TOTAL = 'remittanceTotal',
  RETURN_REMITTANCE_FLAG = 'returnRemittanceFlag',
  ZIP_CODE = 'zipCode',
  ZIP_CODE_PLUS4 = 'zipCodePlus4',
}

export enum PO_PAYMENT_VENDOR_TYPE {
  TBD = 'TBD',
  CARD = 'Card',
  CHECK = 'Check',
  ACH = 'ACH',
}
