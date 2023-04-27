import { NON_PO_PAYMENT_DOCUMENT_TYPE, PO_DETAIL_STATUS } from 'src/queries';

export type CustomFilterPOQueryValue = {
  requestNumber: string;
  documentNumber: string;
  vendorName: string;
  listedProjectNumber: string;
  faStaffReviewer: string;
  piName: string;
  modifiedStartDate: string;
  modifiedEndDate: string;
  checkStartDate: string;
  checkEndDate: string;
  finalApprovedStartDate: string;
  finalApprovedEndDate: string;
  checkNumber: string;

  status: string[];
  paymentMethod: string[];
  documentType: string[];
};

export type CustomFilterNonPOFormValue = {
  requestNumber: string;
  documentNumber: string;
  vendorName: string;
  listedProjectNumber: string;
  faStaffReviewer: string;
  piName: string;
  updatedAt: [Date, Date];

  documentType: NON_PO_PAYMENT_DOCUMENT_TYPE[];
  status: PO_DETAIL_STATUS[];
};

export const emptySearchPendingReviewApproveNonPOFormValue = {
  requestNumber: '',
  documentNumber: '',
  vendorName: '',
  listedProjectNumber: '',
  faStaffReviewer: '',
  piName: '',
  updatedAt: null,

  documentType: [],
  status: [],
};

export const nonPODocumentTypePendingApproveReviewOptions = [
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
];

export const nonPoStatusOptions = [
  {
    label: 'Pending PI Submittal',
    value: PO_DETAIL_STATUS.PI_PENDING_SUBMITTAL,
  },
  {
    label: 'Pending FA Approval',
    value: PO_DETAIL_STATUS.FA_PENDING_APPROVAL,
  },
  {
    label: 'Pending RCUH Approval',
    value: PO_DETAIL_STATUS.RCUH_PENDING_RCUH_APPROVAL,
  },
  {
    label: 'Disapproved',
    value: PO_DETAIL_STATUS.PI_DISAPPROVED,
  },
  {
    label: 'Pending - Additional Info Requested ',
    value: PO_DETAIL_STATUS.PI_ADDITIONAL_INFO_REQUESTED,
  },
  {
    label: 'Pending - Additional Info Requested by RCUH',
    value: PO_DETAIL_STATUS.FA_ADDITIONAL_INFO_REQUESTED_RCUH,
  },
  {
    label: 'Final',
    value: PO_DETAIL_STATUS.FINAL,
  },
];
