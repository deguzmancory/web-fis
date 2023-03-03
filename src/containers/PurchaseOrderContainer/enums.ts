export enum PO_FORM_KEY {
  // general info
  LOGIN_NAME = 'loginName',
  PROJECT_TITLE = 'projectTitle',

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
