import { capitalize, startCase } from 'lodash';
import { DOCUMENT_TYPE } from './enum';

// export const checkStatusType = (location: any) => {
//   let typeStatus: string;
//   let status = location.pathname;
//   if (status.includes(PURCHASING_TABLE_KEY.REVIEW_APPROVAL_PO_PAYMENTS_OVER_24999)) {
//     typeStatus = 'review';
//   } else if (status.includes(PURCHASING_TABLE_KEY.PENDING_PO_DOCUMENT)) {
//     typeStatus = 'pending';
//   } else if (status.includes(PURCHASING_TABLE_KEY.OUTSTANDING_PO_DOCUMENT)) {
//     typeStatus = 'outstanding';
//   } else typeStatus = 'approved';

//   return typeStatus;
// };

export const formatValue = (value: string) => {
  if (!value) return '--';
  return startCase(capitalize(value));
};

export const transformDocumentType = (value: string) => {
  if (!value) return '--';
  switch (value) {
    case DOCUMENT_TYPE.PURCHASE_ORDER:
      return 'PO';
    case DOCUMENT_TYPE.PO_CHANGE:
      return 'Chg';
    case DOCUMENT_TYPE.PO_PAYMENT:
      return 'Pmt';
    default:
      return '';
  }
};
