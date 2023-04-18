export type CustomFilterPOApprovedQueryValue = {
  number: string;
  projectNumber: string;
  vendorName: string;
  paymentRequestNumber: string;
  faReviewer: string;
  piName: string;
  checkNumber: string;
  checkStartDate: string;
  checkEndDate: string;
  finalApprovedStartDate: string;
  finalApprovedEndDate: string;
  printedStartDate: string;
  printedEndDate: string;
  documentType: string;
  paymentType: string;
};

export type CustomFilterPOApprovedFormValue = {
  number: string;
  projectNumber: string;
  vendorName: string;
  paymentRequestNumber: string;
  faReviewer: string;
  piName: string;
  checkNumber: string;
  checkDate: [Date, Date];
  finalApprovedDate: [Date, Date];
  printedDate: [Date, Date];
  documentType: PO_ALL_FORM_DOCUMENT_TYPE[];
  paymentType: PO_PAYMENT_TYPE[];
};

export enum PO_ALL_FORM_DOCUMENT_TYPE {
  PURCHASE_ORDER = 'purchaseOrder',
  PO_CHANGE = 'poChange',
  PO_PAYMENT = 'poPayment',
  PO_FINAL_PAYMENT = 'final',
  PO_PARTIAL_PAYMENT = 'partial',
  PO_ADVANCE_PAYMENT = 'advance',
}

export enum PO_PAYMENT_TYPE {
  CARD = 'Card',
  CHECK = 'Check',
  ACH = 'ACH',
}

export const emptySearchApprovedFormValue = {
  number: '',
  projectNumber: '',
  vendorName: '',
  paymentRequestNumber: '',
  faReviewer: '',
  piName: '',
  checkNumber: '',
  checkDate: null,
  finalApprovedDate: null,
  printedDate: null,
  documentType: [],
  paymentType: [],
};

export const documentTypeApprovedOptions = [
  {
    label: 'PO',
    value: PO_ALL_FORM_DOCUMENT_TYPE.PURCHASE_ORDER,
  },
  {
    label: 'PO Change Form',
    value: PO_ALL_FORM_DOCUMENT_TYPE.PO_CHANGE,
  },
  {
    label: 'Payment - Final',
    value: PO_ALL_FORM_DOCUMENT_TYPE.PO_FINAL_PAYMENT,
  },
  {
    label: 'Payment - Partial',
    value: PO_ALL_FORM_DOCUMENT_TYPE.PO_PARTIAL_PAYMENT,
  },
  {
    label: 'Payment - Advance',
    value: PO_ALL_FORM_DOCUMENT_TYPE.PO_ADVANCE_PAYMENT,
  },
];

export const paymentTypeOptions = [
  {
    label: 'Check',
    value: PO_PAYMENT_TYPE.CHECK,
  },
  {
    label: 'ACH',
    value: PO_PAYMENT_TYPE.ACH,
  },
  {
    label: 'Card',
    value: PO_PAYMENT_TYPE.CARD,
  },
];
