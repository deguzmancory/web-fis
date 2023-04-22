export enum AUTHORIZATION_FOR_PAYMENT_KEY {
  LOGIN_NAME = 'loginName',
  DATE = 'date',
  REQUEST_NUMBER = 'requestNumber',
  VENDOR_NAME = 'vendorName',
  VENDOR_CODE = 'vendorCode',
  VENDOR_ADDRESS = 'vendorAddress',
  DOCUMENT_NUMBER = 'documentNumber',
  DIRECT_INQUIRIES_TO = 'directInquiriesTo',
  PHONE_NUMBER = 'phoneNumber',
  FA_STAFF_REVIEWER = 'faStaffReviewer',

  REASON_FOR_PAYMENT = 'reasonForPayment',
  PI_SIGNATURE = 'piSignature',
  FA_SIGNATURE = 'faSignature',

  MAJOR_VERSION = 'majorVersion',
  FORM_NAME = 'formName',
  SHORT_FORM_NAME = 'shortFormName',
  DOCTYPE = 'docType',
  PREFERRED_PAYMENT_METHOD = 'preferredPaymentMethod',
  PREFERRED_PAYMENT_METHOD_TIMESTAMP = 'preferredPaymentMethodTimestamp',

  MINOR_VERSION = 'minorVersion',
  TOTAL = 'total',
  INTERNAL_COMMENTS = 'internalComments',
  PAYMENT_TOTAL = 'paymentTotal',
  EQUIPMENT_INVENTORY_MANUAL_FLAG = 'equipmentInventoryManualFlag',

  PROJECT_LINE_ITEMS = 'projectLineItems',
  REMITTANCE = 'remittance',
  EQUIPMENT_INVENTORIES = 'equipmentInventories',
  REMITTANCE_LINE_ITEMS = 'remittanceLineItems',

  PLACEHOLDER_FILE_ATTACHMENT = 'placeholderFileAttachment',
  // File Attachments
  FILE_ATTACHMENTS = 'fileAttachments',
}

export enum AUTHORIZATION_REMITTANCE_KEY {
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

export enum AUTHORIZATION_PMT_REMITTANCE_LINE_ITEM_KEY {
  REFERENCE_NUMBER = 'referenceNumber',
  CUSTOMER_ACCOUNT_COMMENT = 'customerAccountComment',
  AMOUNT = 'amount',
}

export enum AUTHORIZATION_PMT_EQUIPMENT_INVENTORIES {
  LINE_NUMBER = 'lineNumber',
  OWNER_SHIP = 'ownership',
  DESCRIPTION = 'description',
  BRAND_NAME = 'brandName',
  SERIAL_NUMBER = 'serialNumber',
  ITEM_COST = 'itemCost',
  PREPARER_NAME = 'preparerName',
  PREPARER_PHONE = 'preparerPhone',
  LOCATION_OF_EQUIPMENT = 'locationOfEquipment',
  COMPONENT = 'component',
  FABRICATED_A = 'fabricatedA',
  FABRICATED_B = 'fabricatedB',
  RECEIVE_DATE = 'receiveDate',
}
