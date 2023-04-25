export interface NonPOListingItem {
  id: string;
  listedProjectNumber: string;
  requestNumber: string;
  documentType: string;
  vendorName: string;
  total: string;
  faStaffReviewer: string;
  status: string;
  updatedAt: string;
  piName: string;
  documentNumber: string;
  minorVersion: number;
  majorVersion: string;
  formName: string;
  shortFormName: string;
  hasFinalPdf: true;
  checkNumber: string;
  checkDate: string;
  acceptedDate: string;
  paymentMethod: string;
}

export enum NON_PO_LISTING_ITEM_KEY {
  ID = 'id',
  LISTED_PROJECT_NUMBER = 'listedProjectNumber',
  REQUEST_NUMBER = 'requestNumber',
  DOCUMENT_TYPE = 'documentType',
  VENDOR_NAME = 'vendorName',
  TOTAL = 'total',
  FA_STAFF_REVIEWER = 'faStaffReviewer',
  STATUS = 'status',
  UPDATED_AT = 'updatedAt',
  PI_NAME = 'piName',
  DOCUMENT_NUMBER = 'documentNumber',
  MINOR_VERSION = 'minorVersion',
  MAJOR_VERSION = 'majorVersion',
  FORM_NAME = 'formName',
  SHORT_FORM_NAME = 'shortFormName',
  HAS_FINAL_PDF = 'hasFinalPdf',
  CHECK_NUMBER = 'checkNumber',
  CHECK_DATE = 'checkDate',
  ACCEPTED_DATE = 'acceptedDate',
  PAYMENT_METHOD = 'paymentMethod',
}
