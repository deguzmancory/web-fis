import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { SELECT_CHANGE_FORM_TYPE_QUERY_KEY } from 'src/containers/POChange/SelectChangeFormType/enums';
import { PO_DETAIL_STATUS, PO_DOCUMENT_TYPE } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { PurchaseOrderItem } from 'src/queries/PurchasingListing';
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

export const getPOStatus = (value: string) => {
  switch (value) {
    case PO_DETAIL_STATUS.FINAL:
      return 'Final';
    case PO_DETAIL_STATUS.PI_ADDITIONAL_INFO_REQUESTED:
      return 'Pending - Additional Info Requested';
    case PO_DETAIL_STATUS.FA_ADDITIONAL_INFO_REQUESTED_RCUH:
      return 'Pending - Additional Info Requested by RCUH';
    case PO_DETAIL_STATUS.PI_DISAPPROVED:
      return 'Disapproved';
    case PO_DETAIL_STATUS.RCUH_PENDING_RCUH_APPROVAL:
      return 'Pending RCUH Approval';
    case PO_DETAIL_STATUS.PI_PENDING_SUBMITTAL:
      return 'Pending PI Submittal';
    case PO_DETAIL_STATUS.FA_PENDING_APPROVAL:
      return 'Pending FA Approval';
  }
};

export const transformDocumentType = (value: string) => {
  if (!value) return '--';
  switch (value) {
    case PO_DOCUMENT_TYPE.PURCHASE_ORDER:
      return 'PO';
    case PO_DOCUMENT_TYPE.PO_CHANGE:
      return 'Chg';
    case PO_DOCUMENT_TYPE.PO_PAYMENT:
      return 'Pmt';
    default:
      return '';
  }
};

export const getPOLinkByDocumentType = (poItem: PurchaseOrderItem) => {
  switch (poItem.documentType) {
    case PO_DOCUMENT_TYPE.PURCHASE_ORDER:
      return (
        <Link to={`${PATHS.purchaseOrderDetail}/${poItem.id}`}>
          <TypographyLink>{poItem.number ?? '--'}</TypographyLink>
        </Link>
      );
    case PO_DOCUMENT_TYPE.PO_CHANGE:
      return (
        <Link to={`${PATHS.poChangeForm}/${poItem.id}`}>
          <TypographyLink>{poItem.number ?? '--'}</TypographyLink>
        </Link>
      );
    case PO_DOCUMENT_TYPE.PO_PAYMENT:
      return (
        <Link to={`${PATHS.poPaymentForm}/${poItem.id}`}>
          <TypographyLink>{poItem.number ?? '--'}</TypographyLink>
        </Link>
      );
    default:
      return null;
  }
};

export const getCreatePOChangeOrPaymentLink = (
  poItem: PurchaseOrderItem,
  typeStatus: PO_DOCUMENT_TYPE
) => {
  switch (typeStatus) {
    case PO_DOCUMENT_TYPE.PO_CHANGE:
      return (
        <Link
          to={`${PATHS.poChangeOptions}?${SELECT_CHANGE_FORM_TYPE_QUERY_KEY.DOCUMENT_ID}=${poItem.id}`}
        >
          <TypographyLink>Create PO Chg</TypographyLink>
        </Link>
      );
    // TODO: Tuyen Tran replace PATHS
    case PO_DOCUMENT_TYPE.PO_PAYMENT:
      return (
        <Link
          to={`${PATHS.poPaymentForm}?${SELECT_CHANGE_FORM_TYPE_QUERY_KEY.DOCUMENT_ID}=${poItem.id}`}
        >
          <TypographyLink>Create PO Pm</TypographyLink>
        </Link>
      );
    default:
      return null;
  }
};
