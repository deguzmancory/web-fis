export enum GetPurchaseOrdersOrderByEnum {
  number = 'number',
  documentType = 'documentType',
  paymentRequestNumber = 'paymentRequestNumber',
  projectNumber = 'projectNumber',
  vendorName = 'vendorName',
  totalAmount = 'totalAmount',
  paymentCheckDate = 'paymentCheckDate',
  checkNumber = 'checkNumber',
  paymentType = 'paymentType',
  finalApprovedDate = 'finalApprovedDate',
  printedDate = 'printedDate',
  piName = 'piName',
  status = 'status',
  updatedAt = 'updatedAt',
  createdAt = 'createdAt',
  faReviewer = 'faReviewer',
  balance = 'balance',
  id = 'id',
}

export enum PoWorkflowStatus {
  PENDING = 'pending',
  REVIEW = 'review',
  ALL = 'all',
  APPROVED = 'approved',
  PO_CHANGE = 'poChange',
  PO_PAYMENT = 'poPayment',
  OUTSTANDING = 'outstanding',
}

export enum PoStatusLevel {
  PI_LEVEL = 'pi',
  FA_LEVEL = 'fa',
  RCUH_LEVEL = 'central',
  FINAL_LEVEL = 'final',
}

export enum PoAttachmentFormType {
  DETERMINATION_CODE = 'determination_of_cost_or_price',
  SOLE_SOURCE_CODE = 'sole_source_justification',
  AUTH_TO_PURCHASE_CODE = 'auth_to_purch_equip_with_federal_funds',
  EQUIPMENT_CODE = 'equip_inventory_form',
  SUBCONTRACTOR_CODE = 'subcontract_agreement',
  AGREEMENT_RCUH_CODE = 'agreement_for_services',
  AGREEMENT_UH_CODE = 'agreement_for_services_uh',
  FFATA_CODE = 'ffaia_data_collection',
}

export enum PoAction {
  save = 'save',
  submit = 'submit',
  approve = 'approve',
  disapprove = 'disapprove',
  additionalInfo = 'additionalInfo',
}

export enum RcuhPaymentType {
  TBD = 'TBD',
  ACH = 'ACH',
  CARD = 'Card',
  CHECK = 'Check',
}

export enum PoChangeFormType {
  TOTAL_CANCELLATION_NUMBER = '1',
  CHANGE_DESCRIPTION_NUMBER = '2',
  INCREASE_DECREASE_AMOUNT_NUMBER = '3',
  INCREASE_DECREASE_AMOUNT_TERMINATED_NUMBER = '4',
}

export enum ProjectClassification {
  RCUH_CLASSIFICATION = 'RCUH',
  UH_CLASSIFICATION = 'UH',
}

export enum ProjectClassificationAs400 {
  RCUH_VALUE = 'r',
  UH_VALUE = 'u',
}

export enum PoPaymentType {
  PARTIAL_TYPE = 'partial',
  FINAL_TYPE = 'final',
  ADVANCE_TYPE = 'advance',
}
