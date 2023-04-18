import { PO_DOCUMENT_TYPE } from 'src/queries';

export type CustomFilterPOPaymentAndChangeFormQueryValue = {
  number: string;
  projectNumber: string;
  vendorName: string;
  faReviewer: string;
  piName: string;
  finalApprovedStartDate: string;
  finalApprovedEndDate: string;
  printedStartDate: string;
  printedEndDate: string;
  documentType: string;
};

export type CustomFilterPOPaymentAndChangeFormFormValue = {
  number: string;
  projectNumber: string;
  vendorName: string;
  faReviewer: string;
  piName: string;
  modifiedDate: [Date, Date];
  finalApprovedDate: [Date, Date];
  printedDate: [Date, Date];
  documentType: PO_CHG_PMT_FORM_DOCUMENT_TYPE[];
};

export enum PO_CHG_PMT_FORM_DOCUMENT_TYPE {
  PURCHASE_ORDER = 'purchaseOrder',
  PO_CHANGE = 'poChange',
}

export const emptySearchPaymentAndChangeFormValue = {
  number: '',
  projectNumber: '',
  vendorName: '',
  faReviewer: '',
  piName: '',
  modifiedDate: null,
  finalApprovedDate: null,
  printedDate: null,
  documentType: [],
};

export const documentTypePaymentAndChangeForm = [
  {
    label: 'PO',
    value: PO_DOCUMENT_TYPE.PURCHASE_ORDER,
  },
  {
    label: 'PO Change Form',
    value: PO_DOCUMENT_TYPE.PO_CHANGE,
  },
];
