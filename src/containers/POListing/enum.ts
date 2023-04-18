export enum PURCHASING_TABLE_KEY {
  REVIEW_APPROVAL_PO_PAYMENTS_OVER_24999 = 'po_review_listing',
  PENDING_PO_DOCUMENT = 'po_pending_listing',
  OUTSTANDING_PO_DOCUMENT = 'po_review_listing',
  APPROVED_PO_DOCUMENT = 'po_approved_listing',
  SEARCH_PO_DOCUMENT = 'po_search',
}

export enum PURCHASING_LIST_WORK_FLOW_STATUS_KEY {
  ALL_PO_DOCUMENTS = 'all',
  PENDING_PO_DOCUMENTS = 'pending',
  REVIEW_APPROVE_PO_DOCUMENTS = 'review',
  APPROVED_PO_DOCUMENTS = 'approved',
  OUTSTANDING_PO_DOCUMENTS = 'outstanding',
  SEARCH_PO_DOCUMENTS = 'all',
  PO_CHANGE = 'poChange',
  PO_PAYMENT = 'poPayment',
}

export enum PO_LIST_QUERY_KEY {
  WORKFLOW_STATUS = 'workflowStatus',
  PO_NUMBER = 'number',
  VENDOR_NAME = 'vendorName',
  PROJECT_NUMBER = 'projectNumber',
  FA_REVIEWER = 'faReviewer',
  PI_NAME = 'piName',
  DOCUMENT_TYPE = 'documentType',
  STATUS = 'status',

  // --- date range
  //for form
  MODIFIED_DATE = 'modifiedDate',
  //for params
  MODIFIED_START_DATE = 'modifiedStartDate',
  MODIFIED_END_DATE = 'modifiedEndDate',
  PAYMENT_REQUEST_NUMBER = 'paymentRequestNumber',
  CHECK_NUMBER = 'checkNumber',
  // for form
  CHECK_DATE = 'checkDate',
  //  for params
  CHECK_START_DATE = 'checkStartDate',
  CHECK_END_DATE = 'checkEndDate',

  // for form
  FINAL_APPROVED_DATE = 'finalApprovedDate',
  // for parmas
  FINAL_APPROVED_START_DATE = 'finalApprovedStartDate',
  FINAL_APPROVED_END_DATE = 'finalApprovedEndDate',
  // for form
  PRINTED_DATE = 'printedDate',
  // for params
  PRINTED_START_DATE = 'printedStartDate',
  PRINTED_END_DATE = 'printedEndDate',

  PAYMENT_TYPE = 'paymentType',
}
