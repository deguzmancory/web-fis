import { PO_PAYMENT_METHOD } from 'src/containers/POListing/TableList/CustomSearch/SearchApproved/helpers';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from 'src/queries';

export type CustomFilterNonPOApprovedQueryValue = {
  requestNumber: string;
  documentNumber: string;
  vendorName: string;
  listedProjectNumber: string;
  faStaffReviewer: string;
  piName: string;
  checkNumber: string;
  checkStartDate: string;
  checkEndDate: string;
  finalApprovedStartDate: string;
  finalApprovedEndDate: string;

  documentType: string[];
  paymentMethod: string[];
};

export type CustomFilterNonPOApprovedFormValue = {
  requestNumber: string;
  documentNumber: string;
  vendorName: string;
  listedProjectNumber: string;
  faStaffReviewer: string;
  piName: string;
  checkNumber: string;
  checkDate: [Date, Date];
  finalApprovedDate: [Date, Date];
  documentType: NON_PO_PAYMENT_DOCUMENT_TYPE[];
  paymentMethod: PO_PAYMENT_METHOD[];
};

export const emptySearchNonPOApprovedFormValue = {
  requestNumber: '',
  documentNumber: '',
  vendorName: '',
  listedProjectNumber: '',
  faStaffReviewer: '',
  piName: '',
  checkNumber: '',
  checkDate: null,
  finalApprovedDate: null,
  documentType: [],
  paymentMethod: [],
};

export const documentTypeNonPOApprovedOptions = [
  {
    label: 'Non Emp Travel',
    value: NON_PO_PAYMENT_DOCUMENT_TYPE.NON_EMPLOYEE_TRAVEL_PAYMENT,
  },
  {
    label: 'Auth For Payment',
    value: NON_PO_PAYMENT_DOCUMENT_TYPE.AUTHORIZATION_PAYMENT,
  },
  {
    label: 'Pers Auto',
    value: NON_PO_PAYMENT_DOCUMENT_TYPE.PERSONAL_AUTO_PAYMENT,
  },
  {
    label: 'Petty Cash',
    value: NON_PO_PAYMENT_DOCUMENT_TYPE.PETTY_CASH_PAYMENT,
  },
  {
    label: 'Reimburse',
    value: NON_PO_PAYMENT_DOCUMENT_TYPE.REIMBURSEMENT_PAYMENT,
  },
  {
    label: 'Multi Travel',
    value: NON_PO_PAYMENT_DOCUMENT_TYPE.MULTI_TRAVEL_PAYMENT,
  },
];
