export enum PO_FORM_ELEMENT_ID {
  ADDITIONAL_FORMS = 'additional-forms',
}

export enum PO_FORM_PARAMS {
  SCROLL_TO = 'scrollTo',
  DOCUMENT_ID = 'documentId',
}

export enum PO_FORM_KEY {
  // general info
  ID = 'id',
  LOGIN_NAME = 'loginName',
  DATE = 'date',
  NUMBER = 'number',
  PREVIOUS_PO_NUMBER = 'previousPoNumber',
  PROJECT_TITLE = 'projectTitle',
  PROJECT_NUMBER = 'projectNumber',
  PI_NAME = 'piName',
  PROJECT_PERIOD = 'projectPeriod',
  SUPER_QUOTE_NUMBER = 'superquoteNumber',
  SUPER_QUOTE_BID_ID = 'superquoteBidId',
  VENDOR_NAME = 'vendorName',
  VENDOR_CODE = 'vendorCode',
  VENDOR_ADDRESS = 'vendorAddress',
  SHIP_VIA = 'shipVia',
  SHIP_TO = 'shipTo',
  SHIP_OTHER = 'shipOther',
  DELIVERY_BY = 'deliveryBy',
  DISCOUNT_TERMS = 'discountTerms',
  QUOTATION_NUMBER = 'quotationNumber',
  DIRECT_INQUIRIES_TO = 'directInquiriesTo',
  PHONE_NUMBER = 'phoneNumber',
  FA_STAFF_REVIEWER = 'faStaffReviewer',

  // line items
  LINE_ITEMS = 'lineItems',
  ORIGINAL_LINE_ITEMS = 'originalLineItems',

  // purchase info
  CONFIRMING = 'confirming',
  GET_EXEMPT = 'getExempt',
  ATTACHMENT_31 = 'attachment31',
  FED_ATTACHMENT = 'fedAttachment',
  UH_SUBAWARD_NUMBER = 'uhSubawardNumber',
  SUBTOTAL = 'subtotal',
  TAX_RATE = 'taxRate',
  TAX_TOTAL = 'taxTotal',
  TOTAL = 'total',
  SHIPPING_TOTAL = 'shippingTotal',

  // additional forms
  AVAILABLE_FORMS = 'availableForms',
  FORM_ATTACHMENTS = 'formAttachments',

  // additional form keys
  SOLE_SOURCE = 'soleSource',
  AUTH_TO_PURCHASE = 'authToPurchase',
  EQUIPMENT_INVENTORY = 'equipmentInventory',
  SUBCONTRACTOR = 'subcontractor',
  AGREEMENT = 'agreement',
  AGREEMENT_UH = 'agreementUh',
  FFATA = 'ffata',
  DETERMINATION = 'determination',

  //Internal Special Instructions
  INTERNAL_A = 'internalA',
  INTERNAL_A1 = 'internalA1',
  INTERNAL_B = 'internalB',
  INTERNAL_C = 'internalC',

  // External Special Instructions
  PRESET_INSTRUCTIONS = 'presetInstructions',
  EXTERNAL_SPECIAL_INSTRUCTIONS = 'externalSpecialInstructions',

  // send invoice info
  SEND_INVOICE_TO = 'sendInvoiceTo',
  SEND_INVOICE_TO_CLEAR_FLAG = 'sendInvoiceToClearFlag',
  SEND_INVOICE_TO_FA_EMAIL = 'sendInvoiceToFaEmail',
  INVOICE_DEPT = 'invoiceDept',
  INVOICE_STREET_ADDRESS = 'invoiceStreetAddress',
  INVOICE_CITY = 'invoiceCity',
  INVOICE_STATE = 'invoiceState',
  INVOICE_ZIP = 'invoiceZip',
  INVOICE_ZIP4 = 'invoiceZip4',
  INVOICE_COUNTRY = 'invoiceCountry',

  //Internal Comments
  PO_COMMENTS = 'poComments',

  //Authorized by
  SIGNATURE = 'signature',

  // File Attachments
  FILE_ATTACHMENTS = 'fileAttachments',

  //Audit
  AUDIT_TRAILS = 'auditTrails',

  //payload only
  ADDRESS_1 = 'address1',
  ADDRESS_2 = 'address2',
  ADDRESS_3 = 'address3',
  ACTION = 'action',
  PLACEHOLDER_FILE_ATTACHMENT = 'placeholderFileAttachment',
  DOCUMENT_TYPE = 'documentType',
  BALANCE = 'balance',

  //PO CHANGE
  FORM_NUMBER = 'formNumber',
  ORIGINAL_SHIPPING_TOTAL = 'originalShippingTotal',
  ORIGINAL_SUBTOTAL = 'originalSubtotal',
  ORIGINAL_TAX_TOTAL = 'originalTaxTotal',
  ORIGINAL_TOTAL = 'originalTotal',
  ORIGINAL_TAX_RATE = 'originalTaxRate',
  REASON_FOR_CHANGE = 'reasonForChange',
  AMOUNT_CHANGE = 'amountChange',

  //PO PAYMENT
  // payment general info
  PAYMENT_LOGIN_NAME = 'paymentLoginName',
  PAYMENT_DATE = 'paymentDate',
  PAYMENT_REQUEST_NUMBER = 'paymentRequestNumber',
  PAYMENT_DIRECT_INQUIRIES_TO = 'paymentDirectInquiriesTo',
  PAYMENT_PHONE_NUMBER = 'paymentPhoneNumber',
  PAYMENT_FA_STAFF_REVIEWER = 'paymentFaStaffReviewer',
  PAYMENT_REMITTANCE = 'remittance',

  // Line items
  REMITTANCE_LINE_ITEMS = 'remittanceLineItems',

  // Receipt Acknowledgment and Payment Authorization Exception
  PAYMENT_RECEIPT_ACKNOWLEDGEMENT = 'paymentReceiptAcknowledgement',
  PAYMENT_TYPE = 'paymentType',

  // Payment Authorized By
  PAYMENT_AUTHORIZED_BY = 'paymentAuthorizedBy',

  // Payment summary
  // PAYMENT_LINE_ITEMS = 'paymentLineItems',
  ADVANCED_PAYMENT_LINE_ITEMS = 'advancePaymentLineItem',
  PARTIAL_OR_FINAL_PAYMENT_LINE_ITEMS = 'partialOrFinalPaymentLineItem',
  PAYMENT_TOTAL = 'paymentTotal',

  // Payment Remaining Balance
  REMAINING_BALANCE = 'remainingBalance',

  // Remittance Information

  // Equipment Inventory
  PAYMENT_EQUIPMENT_INVENTORIES = 'paymentEquipmentInventories',
  PAYMENT_EQUIPMENT_INVENTORY_MANUAL_FLAG = 'paymentEquipmentInventoryManualFlag',
}

export enum PO_ADDITIONAL_FORM_CODE {
  SOLE_SOURCE = 'sole_source_justification',
  AUTH_TO_PURCHASE = 'auth_to_purch_equip_with_federal_funds',
  EQUIPMENT_INVENTORY = 'equip_inventory_form',
  SUBCONTRACTOR = 'subcontract_agreement',
  AGREEMENT_UH = 'agreement_for_services_uh',
  AGREEMENT = 'agreement_for_services',
  FFATA = 'ffaia_data_collection',
  DETERMINATION = 'determination_of_cost_or_price',
}

export enum PO_ADDITIONAL_FORM_EXTERNAL_LINK {
  AGREEMENT = 'https://www.rcuh.com/document-library/2-000/procurement-contracts-2/attachment-8b-agreement-for-services-direct-projects/',
  AGREEMENT_UH = 'https://www.rcuh.com/document-library/2-000/procurement-contracts-2/attachment-8a-agreement-for-services-uh/',
}

export enum PO_LINE_ITEM_KEY {
  ITEM_PROJECT_NUMBER = 'itemProjectNumber',
  SUB_PROJECT = 'subProject',
  BUDGET_CATEGORY = 'budgetCategory',
  SUB_BUDGET_CATEGORY = 'subBudgetCategory',
  DESCRIPTION = 'description',
  QUANTITY = 'quantity',
  UNIT = 'unit',
  UNIT_PRICE = 'unitPrice',
  EXT = 'ext',
  IS_ORIGINAL = 'isOriginal',
}

export enum SUBMITTED_PO_QUERY {
  PO_NUMBER = 'poNumber',
  DOCUMENT_TYPE = 'documentType',
}
