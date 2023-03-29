import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { PURCHASING_LIST_WORK_FLOW_STATUS_KEY } from '../enum';

export const purchasingListType = [
  {
    label: 'All PO Documents',
    value: PURCHASING_LIST_WORK_FLOW_STATUS_KEY.ALL_PO_DOCUMENTS,
    roles: [ROLE_NAME.CU, ROLE_NAME.FA, ROLE_NAME.PI, ROLE_NAME.SU],
  },
  {
    label: 'Pending PO Documents',
    value: PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PENDING_PO_DOCUMENTS,
    roles: [ROLE_NAME.CU, ROLE_NAME.FA, ROLE_NAME.PI, ROLE_NAME.SU],
  },
  {
    label: 'Review/Approve PO Documents',
    value: PURCHASING_LIST_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_PO_DOCUMENTS,
    roles: [ROLE_NAME.FA],
  },
  {
    label: 'Review/Approve PO Documents over $24,999',
    value: PURCHASING_LIST_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_PO_DOCUMENTS,
    roles: [ROLE_NAME.CU],
  },
  {
    label: 'Approved PO Documents',
    value: PURCHASING_LIST_WORK_FLOW_STATUS_KEY.APPROVED_PO_DOCUMENTS,
    roles: [ROLE_NAME.CU, ROLE_NAME.FA, ROLE_NAME.PI, ROLE_NAME.SU],
  },
  {
    label: 'Outstanding PO Documents',
    value: PURCHASING_LIST_WORK_FLOW_STATUS_KEY.OUTSTANDING_PO_DOCUMENTS,
    roles: [ROLE_NAME.CU, ROLE_NAME.FA],
  },
  {
    label: 'Create PO Change Form',
    value: PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_CHANGE,
    roles: [ROLE_NAME.PI, ROLE_NAME.SU],
  },
  {
    label: 'Create PO Payment',
    value: PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_PAYMENT,
    roles: [ROLE_NAME.PI, ROLE_NAME.SU],
  },
];
