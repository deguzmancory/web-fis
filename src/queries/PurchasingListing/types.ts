export interface PurchaseOrderItem {
  id: string;
  status: string;
  number: string;
  documentType: string;
  projectNumber: string;
  vendorName: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  piName: string;
  balance: string;
  printedDate: string;
  formName: string;
  shortFormName: string;
  majorVersion: string;
  minorVersion: number;
  hasFinalPdf: boolean;
  paymentRequestNumber: string;
  paymentDate: string;
  checkDate: string;
  checkNumber: string;
  updateVersionNumber: number;
  paymentType: string;
  paymentMethod: string;
  paymentTotal: number;
  amountChange: number;
  total: string;
  totalAmount: string;
  paymentFaStaffReviewer: string;
  faStaffReviewer: string;
  faReviewer: string;
  rcuhApprovedDate: string;
  faApprovedDate: string;
  finalApprovedDate: string;
  isHistorical: boolean;
}

export interface PurchaseOrders {
  id: string;
  status: string;
  number: string;
  documentType: string;
  projectNumber: string;
  vendorName: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  piName: string;
  balance: string;
  printedDate: string;
  formName: string;
  shortFormName: string;
  majorVersion: string;
  minorVersion: number;
  hasFinalPdf: boolean;
  paymentRequestNumber: string;
  paymentDate: string;
  checkDate: string;
  checkNumber: string;
  updateVersionNumber: number;
  paymentType: string;
  paymentMethod: string;
  paymentTotal: number;
  amountChange: number;
  total: string;
  totalAmount: string;
  paymentFaStaffReviewer: string;
  faStaffReviewer: string;
  faReviewer: string;
  rcuhApprovedDate: string;
  faApprovedDate: string;
  finalApprovedDate: string;
  isHistorical: boolean;
}

export enum PURCHASE_ORDER_KEY {
  ID = 'id',
  STATUS = 'status',
  NUMBER = 'number',
  DOCUMENT_TYPE = 'documentType',
  PROJECT_NUMBER = 'projectNumber',
  VENDOR_NAME = 'vendorName',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DATE = 'date',
  PI_NAME = 'piName',
  BALANCE = 'balance',
  PRINTED_DATE = 'printedDate',
  FORM_NAME = 'formName',
  SHORT_FORM_NAME = 'shortFormName',
  MAJOR_VERSION = 'majorVersion',
  MINOR_VERSION = 'minorVersion',
  HAS_FINAL_PDF = 'hasFinalPdf',
  PAYMENT_REQUEST_NUMBER = 'paymentRequestNumber',
  PAYMENT_DATE = 'paymentDate',
  CHECK_DATE = 'checkDate',
  CHECK_NUMBER = 'checkNumber',
  UPDATE_VERSION_NUMBER = 'updateVersionNumber',
  PAYMENT_TYPE = 'paymentType',
  PAYMENT_METHOD = 'paymentMethod',
  PAYMENT_TOTAL = 'paymentTotal',
  AMOUNT_CHANGE = 'amountChange',
  TOTAL = 'total',
  TOTAL_AMOUNT = 'totalAmount',
  PAYMENT_FA_STAFF_REVIEWER = 'paymentFaStaffReviewer',
  FA_STAFF_REVIEWER = 'faStaffReviewer',
  FA_REVIEWER = 'faReviewer',
  RCUH_APPROVED_DATE = 'rcuhApprovedDate',
  FA_APPROVED_DATE = 'faApprovedDate',
  FINAL_APPROVED_DATE = 'finalApprovedDate',
  IS_HISTORICAL = 'isHistorical',
  MODIFIED_DATE = 'updatedAt',
}

export interface SearchPurchaseParams {
  search?: string;
}
