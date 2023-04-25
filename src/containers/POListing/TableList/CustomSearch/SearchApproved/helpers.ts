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

  documentType: string[];
  paymentType: string[];
  paymentMethod: string[];
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
  paymentMethod: PO_PAYMENT_METHOD[];
};

export enum PO_ALL_FORM_DOCUMENT_TYPE {
  PURCHASE_ORDER = 'purchaseOrder',
  PO_CHANGE = 'poChange',
  PO_PAYMENT = 'poPayment',
}

export enum PO_PAYMENT_METHOD {
  CARD = 'card',
  CHECK = 'check',
  ACH = 'ach',
}

export enum PO_PAYMENT_TYPE {
  PO_FINAL_PAYMENT = 'final',
  PO_PARTIAL_PAYMENT = 'partial',
  PO_ADVANCE_PAYMENT = 'advance',
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
  paymentMethod: [],
};

export const documentTypeApprovedOptions = [
  {
    label: 'PO',
    value: PO_ALL_FORM_DOCUMENT_TYPE.PURCHASE_ORDER,
  },
  {
    label: 'PO Change',
    value: PO_ALL_FORM_DOCUMENT_TYPE.PO_CHANGE,
  },
];

export const paymentTypeOptions = [
  {
    label: 'Payment - Final',
    value: PO_PAYMENT_TYPE.PO_FINAL_PAYMENT,
  },
  {
    label: 'Payment - Partial',
    value: PO_PAYMENT_TYPE.PO_PARTIAL_PAYMENT,
  },
  {
    label: 'Payment - Advance',
    value: PO_PAYMENT_TYPE.PO_ADVANCE_PAYMENT,
  },
];

export const paymentMethodOptions = [
  {
    label: 'Check',
    value: PO_PAYMENT_METHOD.CHECK,
  },
  {
    label: 'ACH',
    value: PO_PAYMENT_METHOD.ACH,
  },
  {
    label: 'Card',
    value: PO_PAYMENT_METHOD.CARD,
  },
];
