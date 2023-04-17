import { PO_DETAIL_STATUS, PO_DOCUMENT_TYPE } from 'src/queries';

export type CustomFilterPOQueryValue = {
  number: string;
  projectNumber: string;
  vendorName: string;
  faReviewer: string;
  piName: string;
  modifiedStartDate: string;
  modifiedEndDate: string;
  documentType: string;
  status: string;
};

export type CustomFilterPOFormValue = {
  number: string;
  projectNumber: string;
  vendorName: string;
  faReviewer: string;
  piName: string;
  modifiedDate: [Date, Date];
  documentType: PO_DOCUMENT_TYPE[];
  status: PO_DETAIL_STATUS[];
};

export const emptySearchPendingReviewApproveFormValue = {
  number: '',
  projectNumber: '',
  vendorName: '',
  faReviewer: '',
  piName: '',
  modifiedDate: null,
  documentType: [],
  status: [],
};

export const documentTypePendingApproveReviewOptions = [
  {
    label: 'PO',
    value: PO_DOCUMENT_TYPE.PURCHASE_ORDER,
  },
  {
    label: 'PO Change Form',
    value: PO_DOCUMENT_TYPE.PO_CHANGE,
  },
  {
    label: 'PO Payment',
    value: PO_DOCUMENT_TYPE.PO_PAYMENT,
  },
];

export const poStatusOptions = [
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
