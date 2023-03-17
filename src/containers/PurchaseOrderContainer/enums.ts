export enum PO_FORM_KEY {
  // general info
  LOGIN_NAME = 'loginName',
  DATE = 'date',
  NUMBER = 'number',
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

  // form keys
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

  //payload only
  ADDRESS_1 = 'address1',
  ADDRESS_2 = 'address2',
  ADDRESS_3 = 'address3',
  ACTION = 'action',
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

export enum PO_ACTION {
  SAVE = 'save',
  SUBMIT = 'submit',
  APPROVE = 'approve',
  DISAPPROVE = 'disapprove',
  ADDITIONAL_INFO = 'additionalInfo',
}

export enum SUBMITTED_PO_QUERY {
  PO_NUMBER = 'poNumber',
}
