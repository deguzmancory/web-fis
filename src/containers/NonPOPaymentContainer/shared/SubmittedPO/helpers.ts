import { PATHS } from 'src/appConfig/paths';
import { PURCHASING_LIST_WORK_FLOW_STATUS_KEY } from 'src/containers/POListing/enum';
import { PO_DOCUMENT_TYPE } from 'src/queries';

export const getSubmittedPOContent = ({
  documentType,
  id,
}: {
  documentType: PO_DOCUMENT_TYPE;
  id: string;
}) => {
  switch (documentType) {
    case PO_DOCUMENT_TYPE.PURCHASE_ORDER:
      return {
        name: 'Purchase Order',
        poNumberName: 'Purchase Order Number',
        viewLink: {
          title: 'View the Purchase Order',
          href: `${PATHS.purchaseOrderDetail}/${id}`,
        },
        createLink: {
          title: 'Create another Purchase Order',
          href: `${PATHS.createPurchaseOrders}`,
        },
      };
    case PO_DOCUMENT_TYPE.PO_CHANGE:
      return {
        name: 'Purchase Order Change',
        poNumberName: 'Purchase Order Number',
        viewLink: {
          title: 'View the Purchase Order Change',
          href: `${PATHS.poChangeForm}/${id}`,
        },
        createLink: {
          title: 'Create another Purchase Order Change',
          href: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_CHANGE}`,
        },
      };
    case PO_DOCUMENT_TYPE.PO_PAYMENT:
      return {
        name: 'Purchase Order Payment',
        poNumberName: ' Payment Request Number',
        viewLink: {
          title: 'View the Purchase Order Payment',
          href: `${PATHS.poPaymentForm}/${id}`,
        },
        createLink: {
          title: 'Create another Purchase Order Payment',
          href: `${PATHS.purchasingOrders}?workflowStatus=${PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_PAYMENT}`,
        },
      };

    default:
      return {
        name: '',
        poNumberName: '',
        viewLink: {
          title: '',
          href: ``,
        },
        createLink: {
          title: '',
          href: ``,
        },
      };
  }
};
