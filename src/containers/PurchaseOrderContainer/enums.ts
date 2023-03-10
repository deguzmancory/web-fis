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
