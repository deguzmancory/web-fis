import { Link } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { NON_PO_PAYMENT_DOCUMENT_TYPE, PO_DETAIL_STATUS } from 'src/queries';
import { NonPOListingItem } from 'src/queries/NonPOListing';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { NON_PO_LISTING_WORK_FLOW_STATUS_KEY } from '../enum';

export const purchasingListType = [
  {
    label: 'All Payments',
    value: NON_PO_LISTING_WORK_FLOW_STATUS_KEY.ALL_DOCUMENT,
    roles: [ROLE_NAME.CU, ROLE_NAME.FA, ROLE_NAME.PI, ROLE_NAME.SU],
  },
  {
    label: 'Pending Payments',
    value: NON_PO_LISTING_WORK_FLOW_STATUS_KEY.PENDING_DOCUMENTS,
    roles: [ROLE_NAME.CU, ROLE_NAME.FA, ROLE_NAME.PI, ROLE_NAME.SU],
  },
  {
    label: 'Review/Approve Payments',
    value: NON_PO_LISTING_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_DOCUMENTS,
    roles: [ROLE_NAME.FA],
  },
  {
    label: 'Review/Approve Payments over $24,999',
    value: NON_PO_LISTING_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_DOCUMENTS,
    roles: [ROLE_NAME.CU],
  },
  {
    label: 'Approved Payments',
    value: NON_PO_LISTING_WORK_FLOW_STATUS_KEY.APPROVED_DOCUMENTS,
    roles: [ROLE_NAME.CU, ROLE_NAME.FA, ROLE_NAME.PI, ROLE_NAME.SU],
  },
];

export const getNonPOStatus = (value: PO_DETAIL_STATUS) => {
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

export const transformNonPODocumentType = (value: string) => {
  if (!value) return '--';
  switch (value) {
    case NON_PO_PAYMENT_DOCUMENT_TYPE.AUTHORIZATION_PAYMENT:
      return 'Auth For Pmnt';
    case NON_PO_PAYMENT_DOCUMENT_TYPE.NON_EMPLOYEE_TRAVEL_PAYMENT:
      return 'Non Emp Trvl';
    case NON_PO_PAYMENT_DOCUMENT_TYPE.PERSONAL_AUTO_PAYMENT:
      return 'Pers Auto';
    case NON_PO_PAYMENT_DOCUMENT_TYPE.PETTY_CASH_PAYMENT:
      return 'Petty Cash';
    case NON_PO_PAYMENT_DOCUMENT_TYPE.REIMBURSEMENT_PAYMENT:
      return 'Reimburse';
    case NON_PO_PAYMENT_DOCUMENT_TYPE.MULTI_TRAVEL_PAYMENT:
      return 'Multi Travel';
    default:
      return '--';
  }
};

export const getNonPOLinkByDocumentType = (nonPOItem: NonPOListingItem) => {
  switch (nonPOItem.documentType) {
    case NON_PO_PAYMENT_DOCUMENT_TYPE.AUTHORIZATION_PAYMENT:
      return (
        <Link to={`${PATHS.authorizationForPaymentDetail}/${nonPOItem.id}`}>
          <TypographyLink>{nonPOItem.requestNumber ?? '--'}</TypographyLink>
        </Link>
      );
    case NON_PO_PAYMENT_DOCUMENT_TYPE.NON_EMPLOYEE_TRAVEL_PAYMENT:
      return (
        <Link to={`${PATHS.nonEmployeeTravelPaymentDetail}/${nonPOItem.id}`}>
          <TypographyLink>{nonPOItem.requestNumber ?? '--'}</TypographyLink>
        </Link>
      );
    case NON_PO_PAYMENT_DOCUMENT_TYPE.PERSONAL_AUTO_PAYMENT:
      return (
        <Link to={`${PATHS.personalAutoPaymentDetail}/${nonPOItem.id}`}>
          <TypographyLink>{nonPOItem.requestNumber ?? '--'}</TypographyLink>
        </Link>
      );
    case NON_PO_PAYMENT_DOCUMENT_TYPE.PETTY_CASH_PAYMENT:
      return (
        <Link to={`${PATHS.pettyCashPaymentDetail}/${nonPOItem.id}`}>
          <TypographyLink>{nonPOItem.requestNumber ?? '--'}</TypographyLink>
        </Link>
      );
    case NON_PO_PAYMENT_DOCUMENT_TYPE.REIMBURSEMENT_PAYMENT:
      return (
        <Link to={`${PATHS.reimbursementPayment}/${nonPOItem.id}`}>
          <TypographyLink>{nonPOItem.requestNumber ?? '--'}</TypographyLink>
        </Link>
      );
    case NON_PO_PAYMENT_DOCUMENT_TYPE.MULTI_TRAVEL_PAYMENT:
      return (
        <Link to={`${PATHS.multiTravelPayment}/${nonPOItem.id}`}>
          <TypographyLink>{nonPOItem.requestNumber ?? '--'}</TypographyLink>
        </Link>
      );
    default:
      return null;
  }
};
