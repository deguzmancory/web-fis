export enum NON_PO_LISTING_TABLE_KEY {
  REVIEW_APPROVAL_PO_PAYMENTS_OVER_24999 = 'po_review_listing',
  PENDING_PO_DOCUMENT = 'po_pending_listing',
  OUTSTANDING_PO_DOCUMENT = 'po_review_listing',
  APPROVED_PO_DOCUMENT = 'po_approved_listing',
  SEARCH_PO_DOCUMENT = 'po_search',
}

export enum NON_PO_LISTING_WORK_FLOW_STATUS_KEY {
  ALL_DOCUMENT = 'all',
  PENDING_DOCUMENTS = 'pending',
  REVIEW_APPROVE_DOCUMENTS = 'review',
  APPROVED_DOCUMENTS = 'approved',
  SEARCH_DOCUMENTS = 'all',
}

export enum NON_PO_LISTING_QUERY_KEY {
  WORKFLOW_STATUS = 'workflowStatus',
  REQUEST_NUMBER = 'requestNumber',
  DOCUMENT_NUMBER = 'documentNumber',
  VENDOR_NAME = 'vendorName',
  LISTED_PROJECT_NUMBER = 'listedProjectNumber',
  FA_STAFF_REVIEWER = 'faStaffReviewer',
  PI_NAME = 'piName',
  MODIFIED_START_DATE = 'modifiedStartDate',
  MODIFIED_END_DATE = 'modifiedEndDate',

  DOCUMENT_TYPE = 'documentType',
  STATUS = 'status',
  PAYMENT_METHOD = 'paymentMethod',

  //approved
  CHECK_NUMBER = 'checkNumber',
  CHECK_START_DATE = 'checkStartDate',
  CHECK_END_DATE = 'checkEndDate',
  FINAL_APPROVED_START_DATE = 'finalApprovedStartDate',
  FINAL_APPROVED_END_DATE = 'finalApprovedEndDate',

  //for form
  MODIFIED_DATE = 'MODIFIED_DATE',
  CHECK_DATE = 'checkDate',
  FINAL_APPROVED_DATE = 'finalApprovedDate',
}
